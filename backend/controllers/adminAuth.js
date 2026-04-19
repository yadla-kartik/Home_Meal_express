const adminAuth = require('../models/adminAuth')
const { generateToken } = require('../utils/jwtAuth')
const { buildAuthCookieOptions } = require('../utils/authCookies')

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000
const strongPasswordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

const normalizeEmail = (value) => String(value || '').trim().toLowerCase()
const normalizePhone = (value) => String(value || '').replace(/\D/g, '').slice(0, 10)
const normalizeAdminCode = (value) => String(value || '').trim().toUpperCase()

const serializeAdmin = (adminDoc) => {
  if (!adminDoc) return null

  const admin = typeof adminDoc.toObject === 'function' ? adminDoc.toObject() : { ...adminDoc }
  delete admin.password
  return admin
}

const buildAdminSessionPayload = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  phone: admin.phone,
  adminCode: admin.adminCode,
  mustChangePassword: Boolean(admin.mustChangePassword),
})

const setAdminCookie = (res, admin) => {
  const token = generateToken(buildAdminSessionPayload(admin), '7d')

  res.cookie('adminToken', token, buildAuthCookieOptions(COOKIE_MAX_AGE))

  return token
}

const validateNewPassword = (password) => {
  if (!strongPasswordRule.test(String(password || ''))) {
    return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
  }

  return null
}

const signIn = async (req, res) => {
  try {
    const loginId = String(req.body?.email || '').trim()
    const email = normalizeEmail(loginId)
    const adminCode = normalizeAdminCode(loginId)
    const password = String(req.body?.password || '')

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'Email/admin code and password are required.' })
    }

    const findAdmin = await adminAuth.findOne({
      $or: [{ email }, { adminCode }],
    })

    if (!findAdmin) {
      return res.status(404).json({ success: false, message: 'Admin not found. Check the email or admin code and try again.' })
    }

    const isMatch = await findAdmin.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = setAdminCookie(res, findAdmin)

    return res.status(200).json({
      success: true,
      message: findAdmin.mustChangePassword
        ? 'Login successful. Please set your new password to continue.'
        : 'Login successful.',
      adminUser: serializeAdmin(findAdmin),
      requiresPasswordChange: Boolean(findAdmin.mustChangePassword),
      token,
    })
  } catch (err) {
    console.error('Error occurred while signIn in adminAuth controller:', err.message)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

const signUp = async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim()
    const email = normalizeEmail(req.body?.email)
    const phone = normalizePhone(req.body?.phone)
    const adminCode = normalizeAdminCode(req.body?.adminCode)
    const password = String(req.body?.password || '')

    if (!name || !email || phone.length !== 10 || !adminCode || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' })
    }

    const passwordError = validateNewPassword(password)
    if (passwordError) {
      return res.status(400).json({ success: false, message: passwordError })
    }

    const existingAdmin = await adminAuth.findOne({ $or: [{ email }, { adminCode }] })

    if (existingAdmin) {
      return res.status(409).json({ success: false, message: 'Admin with this Email or Admin Code already exists' })
    }

    const createAdmin = await adminAuth.create({
      name,
      email,
      phone,
      adminCode,
      password,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    })

    const token = setAdminCookie(res, createAdmin)

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      adminUser: serializeAdmin(createAdmin),
      token,
    })
  } catch (err) {
    console.error('Error occurred while signUp in adminAuth controller:', err.message)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

const changePassword = async (req, res) => {
  try {
    const adminId = req.user?.id
    const currentPassword = String(req.body?.currentPassword || '')
    const newPassword = String(req.body?.newPassword || '')
    const confirmPassword = String(req.body?.confirmPassword || '')

    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirm password are required.' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirm password must match.' })
    }

    const passwordError = validateNewPassword(newPassword)
    if (passwordError) {
      return res.status(400).json({ success: false, message: passwordError })
    }

    const findAdmin = await adminAuth.findById(adminId)

    if (!findAdmin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' })
    }

    if (!findAdmin.mustChangePassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required.' })
      }

      const currentPasswordValid = await findAdmin.comparePassword(currentPassword)
      if (!currentPasswordValid) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect.' })
      }
    }

    const isSameAsExisting = await findAdmin.comparePassword(newPassword)
    if (isSameAsExisting) {
      return res.status(400).json({ success: false, message: 'Please choose a different password.' })
    }

    findAdmin.password = newPassword
    findAdmin.mustChangePassword = false
    findAdmin.passwordChangedAt = new Date()
    await findAdmin.save()

    const token = setAdminCookie(res, findAdmin)

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
      adminUser: serializeAdmin(findAdmin),
      token,
    })
  } catch (err) {
    console.error('Error occurred while changePassword in adminAuth controller:', err.message)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

module.exports = {
  signIn,
  signUp,
  changePassword,
}
