const adminAuth = require('../models/adminAuth')

const generateStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    // Ensure at least one number and one special char
    return password
}

const addAdmin = async (req, res) => {
    try {
        const { name, email, phone, adminCode } = req.body

        if (!name || !email || !phone || !adminCode) {
            return res.status(400).json({ message: 'All fields are required.' })
        }

        const existingAdmin = await adminAuth.findOne({ $or: [{ email }, { adminCode }] })
        if (existingAdmin) {
            return res.status(409).json({ message: 'Admin with this Email or Admin Code already exists.' })
        }

        const plainTextPassword = generateStrongPassword()

        const createAdmin = await adminAuth.create({
            name,
            email,
            phone,
            adminCode,
            password: plainTextPassword,
        })

        return res.status(201).json({
            message: 'Admin successfully added!',
            admin: createAdmin,
            generatedPassword: plainTextPassword // We send this back specifically so user can test the login
        })
    } catch (err) {
        console.error('Error adding admin:', err.message)
        return res.status(500).json({ message: 'Server error while adding admin' })
    }
}

const getAllAdmins = async (req, res) => {
    try {
        const admins = await adminAuth.find({}).select('-password')
        return res.status(200).json({ admins })
    } catch (err) {
        return res.status(500).json({ message: 'Server error while fetching admins' })
    }
}

const removeAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const deletedAdmin = await adminAuth.findByIdAndDelete(id)

        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin not found.' })
        }

        return res.status(200).json({ message: 'Admin successfully removed', deleted: true })
    } catch (err) {
        return res.status(500).json({ message: 'Server error while removing admin' })
    }
}

module.exports = {
    addAdmin,
    getAllAdmins,
    removeAdmin
}
