const crypto = require('crypto')
const user = require('../models/user')
const userOtp = require('../models/userOtp')
const { generateToken } = require('../utils/jwtAuth')

const MSG91_VERIFY_ACCESS_TOKEN_URL = 'https://control.msg91.com/api/v5/widget/verifyAccessToken'
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || process.env.MSG91_TOKEN_AUTH || ''
const OTP_SECRET = process.env.OTP_HASH_SECRET || process.env.JWT_SECRET || 'home-meal-express-otp-secret'
const OTP_TTL_MS = 5 * 60 * 1000
const OTP_LENGTH = 6

const normalizeMobileNo = (value) => String(value ?? '').replace(/\D/g, '').slice(0, 10)

const generateOtp = () => String(crypto.randomInt(100000, 1000000))

const hashOtp = (mobileNo, otp) =>
  crypto.createHmac('sha256', OTP_SECRET).update(`${mobileNo}:${otp}`).digest('hex')

const maskMobileNo = (value) => {
  if (!value || value.length < 10) return value
  return `${value.slice(0, 2)}******${value.slice(-2)}`
}

const normalizeToken = (value) => {
  const token = String(value ?? '').trim()
  return token || ''
}

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

const issueUserSession = async ({ mobileNo, name, country }) => {
  const findUser = await user.findOneAndUpdate(
    { mobileNo },
    {
      $set: {
        name,
        country,
        mobileNo,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  const token = generateToken({
    id: findUser._id,
    name: findUser.name,
    mobileNo: findUser.mobileNo,
    country: findUser.country,
  })

  return { findUser, token }
}

const sendOtp = async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim()
    const country = String(req.body?.country || '+91').trim() || '+91'
    const mobileNo = normalizeMobileNo(req.body?.mobileNo)

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' })
    }

    if (mobileNo.length !== 10) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit mobile number.' })
    }

    const otp = generateOtp()
    const otpHash = hashOtp(mobileNo, otp)

    await userOtp.deleteMany({ mobileNo })
    await userOtp.create({
      mobileNo,
      name,
      country,
      otpHash,
      attemptsLeft: 5,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    })

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully.',
      mobileNo: maskMobileNo(mobileNo),
      otp,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to send OTP.',
    })
  }
}

const verifyOtp = async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim()
    const country = String(req.body?.country || '+91').trim() || '+91'
    const mobileNo = normalizeMobileNo(req.body?.mobileNo)
    const otp = String(req.body?.otp || '').replace(/\D/g, '').slice(0, OTP_LENGTH)

    if (mobileNo.length !== 10) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit mobile number.' })
    }

    if (otp.length !== OTP_LENGTH) {
      return res.status(400).json({ success: false, message: 'Enter the 6-digit OTP.' })
    }

    const otpRecord = await userOtp.findOne({ mobileNo }).sort({ createdAt: -1 })

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired. Please resend.' })
    }

    if (otpRecord.expiresAt && otpRecord.expiresAt.getTime() < Date.now()) {
      await userOtp.deleteMany({ mobileNo })
      return res.status(400).json({ success: false, message: 'OTP expired. Please resend.' })
    }

    const expectedHash = hashOtp(mobileNo, otp)
    if (expectedHash !== otpRecord.otpHash) {
      const remaining = Math.max((otpRecord.attemptsLeft || 1) - 1, 0)
      if (remaining <= 0) {
        await userOtp.deleteMany({ mobileNo })
        return res.status(400).json({ success: false, message: 'Too many wrong attempts. Please resend OTP.' })
      }

      otpRecord.attemptsLeft = remaining
      await otpRecord.save()

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} left.`,
      })
    }

    await userOtp.deleteMany({ mobileNo })

    const { findUser, token } = await issueUserSession({
      mobileNo,
      name: name || otpRecord.name,
      country: country || otpRecord.country || '+91',
    })

    res.cookie('UserToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      user: findUser,
      token,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to verify OTP.',
    })
  }
}

module.exports = {
  sendOtp,
  verifyOtp,
  verifyAccessToken: async (req, res) => {
    try {
      console.log('[DEBUG Backend] Verify Access Token route hit!')
      const accessToken = normalizeToken(req.body?.accessToken || req.body?.['access-token'])
      const name = String(req.body?.name || '').trim()
      const country = String(req.body?.country || '+91').trim() || '+91'
      const mobileNo = normalizeMobileNo(req.body?.mobileNo)

      console.log('[DEBUG Backend] MobileNo:', mobileNo, 'AccessToken:', accessToken ? 'PRESENT' : 'MISSING')

      if (!accessToken) {
        return res.status(400).json({ success: false, message: 'Access token is required.' })
      }

      console.log('[DEBUG Backend] Calling MSG91 to verify accessToken...')
      const verification = await verifyMsg91AccessToken(accessToken)
      console.log('[DEBUG Backend] MSG91 verifyAccessToken Response:', verification)

      if (verification?.type === 'error' || verification?.success === false) {
        console.error('[DEBUG Backend] Verification Rejected by MSG91 API:', verification)
        return res.status(400).json({
          success: false,
          message: verification?.message || verification?.error || 'Access token verification failed.',
        })
      }

      const resolvedMobileNo =
        normalizeMobileNo(verification?.mobile || verification?.data?.mobile || mobileNo) || mobileNo

      if (!resolvedMobileNo || resolvedMobileNo.length !== 10) {
        console.error('[DEBUG Backend] Resolved mobile invalid:', resolvedMobileNo)
        return res.status(400).json({
          success: false,
          message: 'Verified mobile number is invalid.',
        })
      }

      const resolvedName =
        String(verification?.name || verification?.data?.name || name || 'User').trim() || 'User'

      console.log('[DEBUG Backend] Issuing user session for:', resolvedMobileNo)
      const { findUser, token } = await issueUserSession({
        mobileNo: resolvedMobileNo,
        name: resolvedName,
        country,
      })

      res.cookie('UserToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      console.log('[DEBUG Backend] Access token perfectly verified.')
      return res.status(200).json({
        success: true,
        message: 'Access token verified successfully.',
        user: findUser,
        token,
        verification,
      })
    } catch (err) {
      console.error('[DEBUG Backend] Exception during verifyAccessToken:', err.message)
      return res.status(500).json({
        success: false,
        message: err.message || 'Unable to verify access token.',
      })
    }
  },
}
