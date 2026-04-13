const deliveryAuth = require('../models/deliveryAuth')
const { generateToken } = require('../utils/jwtAuth')

const MSG91_VERIFY_ACCESS_TOKEN_URL = 'https://control.msg91.com/api/v5/widget/verifyAccessToken'
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || process.env.MSG91_TOKEN_AUTH || ''

const normalizeMobileNo = (value) => String(value ?? '').replace(/\D/g, '').slice(0, 10)
const normalizeToken = (value) => String(value ?? '').trim()

const verifyMsg91AccessToken = async (accessToken) => {
  if (!MSG91_AUTH_KEY) {
    throw new Error('MSG91 auth key is missing on the backend.')
  }

  const response = await fetch(MSG91_VERIFY_ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      authkey: MSG91_AUTH_KEY,
      'access-token': accessToken,
    }),
  })

  const text = await response.text()
  let payload = null

  try {
    payload = JSON.parse(text)
  } catch {
    payload = { raw: text }
  }

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `MSG91 verification failed with HTTP ${response.status}`)
  }

  return payload
}

const issueDeliverySession = async ({ mobileNo, name }) => {
  const findDeliveryBoy = await deliveryAuth.findOneAndUpdate(
    { mobileNo },
    {
      $set: {
        name,
        mobileNo,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  const token = generateToken({
    id: findDeliveryBoy._id,
    name: findDeliveryBoy.name,
    mobileNo: findDeliveryBoy.mobileNo,
    isRegistered: findDeliveryBoy.isRegistered,
  })

  return { findDeliveryBoy, token }
}

const verifyAccessToken = async (req, res) => {
  try {
    const accessToken = normalizeToken(req.body?.accessToken || req.body?.['access-token'])
    const name = String(req.body?.name || '').trim()
    const mobileNo = normalizeMobileNo(req.body?.mobileNo)

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'Access token is required.' })
    }

    const verification = await verifyMsg91AccessToken(accessToken)

    if (verification?.type === 'error' || verification?.success === false) {
      return res.status(400).json({
        success: false,
        message: verification?.message || verification?.error || 'Access token verification failed.',
      })
    }

    const resolvedMobileNo =
      normalizeMobileNo(verification?.mobile || verification?.data?.mobile || mobileNo) || mobileNo

    if (!resolvedMobileNo || resolvedMobileNo.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Verified mobile number is invalid.',
      })
    }

    const resolvedName =
      String(verification?.name || verification?.data?.name || name || 'Delivery Partner').trim() ||
      'Delivery Partner'

    const { findDeliveryBoy, token } = await issueDeliverySession({
      mobileNo: resolvedMobileNo,
      name: resolvedName,
    })

    res.cookie('DeliveryToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      deliveryBoy: findDeliveryBoy,
      token,
      verification,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to verify OTP.',
    })
  }
}

module.exports = {
  verifyAccessToken,
}
