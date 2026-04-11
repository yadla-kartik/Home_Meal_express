const BASE_URL = 'https://irctc-connect-api.rajivdubey.tech'
const SDK_VERSION = '1'
const DEFAULT_SIGNING_SECRET = '97c56e08b27b161124f88acd4f24d1bd50f48075f11dc23b9ea6c0bc9b2f8794'

let apiKey = ''
let signingSecret = DEFAULT_SIGNING_SECRET

const textEncoder = new TextEncoder()

const toHex = (buffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('')
const onlyDigits = (value) => String(value ?? '').replace(/\D/g, '').slice(0, 10)
const onlyTrainNo = (value) => String(value ?? '').replace(/\D/g, '').slice(0, 5)
const upper = (value) => String(value ?? '').trim().toUpperCase()

const sha256Hex = async (value) => {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(value))
  return toHex(digest)
}

const hmacSha256Hex = async (secret, value) => {
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(value))
  return toHex(signature)
}

const randomNonceHex = () => {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return toHex(bytes)
}

export function configure(key) {
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid API key')
  }

  apiKey = key.trim()
}

const formatDateForApi = (value) => {
  if (!value) {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  if (value instanceof Date) {
    const dd = String(value.getDate()).padStart(2, '0')
    const mm = String(value.getMonth() + 1).padStart(2, '0')
    const yyyy = value.getFullYear()
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

const requestJson = async (path) => {
  if (!apiKey) {
    return { success: false, error: 'irctc-connect is not configured' }
  }

  const timestamp = String(Date.now())
  const nonce = randomNonceHex()
  const payloadHash = await sha256Hex('')
  const signature = await hmacSha256Hex(signingSecret, ['GET', path, timestamp, nonce, payloadHash, apiKey].join('\n'))

  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
      Accept: 'application/json',
      'x-irctc-sdk-ts': timestamp,
      'x-irctc-sdk-nonce': nonce,
      'x-irctc-sdk-payload-sha256': payloadHash,
      'x-irctc-sdk-signature': signature,
      'x-irctc-sdk-version': SDK_VERSION,
    },
  })

  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    return { success: false, error: body?.error || body || `HTTP ${response.status}` }
  }

  return body
}

export async function checkPNRStatus(rawPnr) {
  const pnr = onlyDigits(rawPnr)
  if (pnr.length !== 10) {
    return { success: false, error: 'PNR number must be exactly 10 digits' }
  }

  return requestJson(`/api/checkPNRStatus/${pnr}`)
}

export async function getTrainInfo(rawTrainNumber) {
  const trainNumber = onlyTrainNo(rawTrainNumber)
  if (trainNumber.length !== 5) {
    return { success: false, error: 'Invalid train number. It must be a 5-digit string.' }
  }

  return requestJson(`/api/getTrainInfo/${upper(trainNumber)}`)
}

export async function trackTrain(rawTrainNumber, date) {
  const trainNumber = onlyTrainNo(rawTrainNumber)
  if (trainNumber.length !== 5) {
    return { success: false, error: 'Invalid train number. It must be a 5-digit string.' }
  }

  return requestJson(`/api/trackTrain/${upper(trainNumber)}/${encodeURIComponent(formatDateForApi(date))}`)
}

export async function liveAtStation(rawStationCode) {
  const stationCode = String(rawStationCode ?? '').trim()
  if (!stationCode) {
    return { success: false, error: 'Invalid station code.' }
  }

  return requestJson(`/api/liveAtStation/${upper(stationCode)}`)
}

export async function searchTrainBetweenStations(rawFrom, rawTo) {
  const from = String(rawFrom ?? '').trim()
  const to = String(rawTo ?? '').trim()
  if (!from || !to) {
    return { success: false, error: 'Invalid station codes.' }
  }

  return requestJson(`/api/searchTrainBetweenStations/${upper(from)}/${upper(to)}`)
}

export async function getAvailability(rawTrainNo, rawFrom, rawTo, date, rawCoach, rawQuota) {
  const trainNo = onlyTrainNo(rawTrainNo)
  const from = String(rawFrom ?? '').trim()
  const to = String(rawTo ?? '').trim()
  const coach = String(rawCoach ?? '').trim()
  const quota = String(rawQuota ?? '').trim()

  if (trainNo.length !== 5 || !from || !to || !date || !coach || !quota) {
    return { success: false, error: 'Incomplete data. Please provide all required fields.' }
  }

  return requestJson(
    `/api/getAvailability/${upper(trainNo)}/${upper(from)}/${upper(to)}/${encodeURIComponent(formatDateForApi(date))}/${upper(coach)}/${upper(quota)}`,
  )
}
