const crypto = require('crypto')
const adminAuth = require('../models/adminAuth')
const { sendAdminOnboardingEmail } = require('../utils/adminOnboardingEmail')

const normalizeEmail = (value) => String(value || '').trim().toLowerCase()
const normalizePhone = (value) => String(value || '').replace(/\D/g, '').slice(0, 10)
const normalizeAdminCode = (value) => String(value || '').trim().toUpperCase()

const createOneTimePassword = () => String(crypto.randomInt(100000, 1000000))

const serializeAdmin = (adminDoc) => {
  if (!adminDoc) return null

  const admin = typeof adminDoc.toObject === 'function' ? adminDoc.toObject() : { ...adminDoc }
  delete admin.password
  return admin
}

const addAdmin = async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim()
    const email = normalizeEmail(req.body?.email)
    const phone = normalizePhone(req.body?.phone)
    const adminCode = normalizeAdminCode(req.body?.adminCode)

    if (!name || !email || phone.length !== 10 || !adminCode) {
      return res.status(400).json({ success: false, message: 'Name, email, 10-digit phone number, and admin code are required.' })
    }

    const existingAdmin = await adminAuth.findOne({ $or: [{ email }, { adminCode }] })
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: 'Admin with this email or admin code already exists.' })
    }

    const oneTimePassword = createOneTimePassword()

    const createAdmin = await adminAuth.create({
      name,
      email,
      phone,
      adminCode,
      password: oneTimePassword,
      mustChangePassword: true,
      onboardingEmailSentAt: new Date(),
    })

    try {
      await sendAdminOnboardingEmail({
        name,
        email,
        adminCode,
        otp: oneTimePassword,
      })
      console.log('[SuperAdmin:addAdmin] Onboarding email sent successfully:', { email })
    } catch (mailError) {
      await adminAuth.findByIdAndDelete(createAdmin._id)
      console.error('Error sending admin onboarding email:', mailError.message)
      return res.status(500).json({
        success: false,
        message: `Admin could not be created because the onboarding email failed to send. ${mailError.message}`,
      })
    }

    return res.status(201).json({
      success: true,
      message: 'Admin added successfully and one-time password sent by email.',
      admin: serializeAdmin(createAdmin),
      emailSentTo: email,
    })
  } catch (err) {
    console.error('Error adding admin:', err.message)
    return res.status(500).json({ success: false, message: 'Server error while adding admin' })
  }
}

const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminAuth.find({}).select('-password').sort({ createdAt: -1 })
    return res.status(200).json({ success: true, admins })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error while fetching admins' })
  }
}

const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const deletedAdmin = await adminAuth.findByIdAndDelete(id)

    if (!deletedAdmin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' })
    }

    return res.status(200).json({ success: true, message: 'Admin successfully removed', deleted: true })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error while removing admin' })
  }
}

module.exports = {
  addAdmin,
  getAllAdmins,
  removeAdmin,
}
