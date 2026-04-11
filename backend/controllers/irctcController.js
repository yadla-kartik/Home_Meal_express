const crypto = require('crypto')

const BASE_URL = 'https://irctc-connect-api.rajivdubey.tech'
const SDK_VERSION = '1'
const DEFAULT_SIGNING_SECRET = '97c56e08b27b161124f88acd4f24d1bd50f48075f11dc23b9ea6c0bc9b2f8794'

const apiKey = process.env.IRCTC_API_KEY || ''
const signingSecret = process.env.IRCTC_SIGNING_SECRET || DEFAULT_SIGNING_SECRET

const onlyTrainNo = (value) => String(value ?? '').replace(/\D/g, '').slice(0, 5)

const formatDateForApi = (value) => {
  if (!value) {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  const text = String(value).trim()
  if (/^\d{2}-\d{2}-\d{4}$/.test(text)) return text
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [yyyy, mm, dd] = text.split('-')
    return `${dd}-${mm}-${yyyy}`
  }

  return text
}

const sha256Hex = (value) =>
  crypto.createHash('sha256').update(value).digest('hex')

const hmacSha256Hex = (secret, value) =>
  crypto.createHmac('sha256', secret).update(value).digest('hex')

const randomNonceHex = () => crypto.randomBytes(32).toString('hex')

const buildHeaders = async (path) => {
  const timestamp = String(Date.now())
  const nonce = randomNonceHex()
  const payloadHash = sha256Hex('')
  const signature = hmacSha256Hex(
    signingSecret,
    ['GET', path, timestamp, nonce, payloadHash, apiKey].join('\n'),
  )

  return {
    'x-api-key': apiKey,
    Accept: 'application/json',
    'x-irctc-sdk-ts': timestamp,
    'x-irctc-sdk-nonce': nonce,
    'x-irctc-sdk-payload-sha256': payloadHash,
    'x-irctc-sdk-signature': signature,
    'x-irctc-sdk-version': SDK_VERSION,
  }
}

const readJson = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

const fetchJson = async (path) => {
  if (!apiKey) {
    return { success: false, error: 'IRCTC_API_KEY is missing on the backend.' }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: await buildHeaders(path),
  })

  const body = await readJson(response)
  if (!response.ok) {
    return {
      success: false,
      error: body?.error || body || `HTTP ${response.status}`,
    }
  }

  return body
}

exports.getTrainSummary = async (req, res) => {
  try {
    const trainNo = onlyTrainNo(req.params.trainNo)
    const date = formatDateForApi(req.query.date)

    if (trainNo.length !== 5) {
      return res.status(400).json({
        success: false,
        error: 'Invalid train number. It must be a 5-digit string.',
      })
    }

    const [trainInfoResult, liveResult] = await Promise.all([
      fetchJson(`/api/getTrainInfo/${trainNo}`),
      fetchJson(`/api/trackTrain/${trainNo}/${encodeURIComponent(date)}`),
    ])

    if (!trainInfoResult?.success && !liveResult?.success) {
      return res.status(400).json({
        success: false,
        error: trainInfoResult?.error || liveResult?.error || 'Unable to fetch train details.',
      })
    }

    const data = {
      trainInfo: trainInfoResult?.data?.trainInfo || trainInfoResult?.data || {},
      route: trainInfoResult?.data?.route || [],
      live: liveResult?.data || {},
    }

    return res.status(200).json({ success: true, data })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Unable to fetch train summary.',
    })
  }
}
