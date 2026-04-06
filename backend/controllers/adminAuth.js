const adminAuth = require('../models/adminAuth')
const { generateToken } = require('../utils/jwtAuth')

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body

    const findAdmin = await adminAuth.findOne({ email })

    if (!findAdmin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    const isMatch = await findAdmin.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken({
      id: findAdmin._id,
      name: findAdmin.name,
      email: findAdmin.email,
      phone: findAdmin.phone,
    })

    res.cookie('adminToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      message: 'Login Successful',
      adminUser: findAdmin,
      token,
    })
  } catch (err) {
    console.error('Error occurred while signIn in adminAuth controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

const signUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    const existingAdmin = await adminAuth.findOne({ email })

    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin already exists' })
    }

    const createAdmin = await adminAuth.create({
      name,
      email,
      phone,
      password,
    })

    const token = generateToken({
      id: createAdmin._id,
      name: createAdmin.name,
      email: createAdmin.email,
      phone: createAdmin.phone,
    })

    res.cookie('adminToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    })

    return res.status(201).json({
      message: 'Admin created successfully',
      adminUser: createAdmin,
      token,
    })
  } catch (err) {
    console.error('Error occurred while signUp in adminAuth controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  signIn,
  signUp,
}
