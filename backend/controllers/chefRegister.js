const fs = require('fs')
const path = require('path')
const chefAuth = require('../models/chefAuth')
const chefRegister = require('../models/chefRegister')
const { generateToken } = require('../utils/jwtAuth')
const { encryptField } = require('../utils/fieldCrypto')

const cleanupUploadedFiles = (files = {}) => {
    Object.values(files).flat().forEach((file) => {
        if (!file?.path) return

        const absolutePath = path.resolve(file.path)
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath)
        }
    })
}

const createChefRegister = async (req, res) => {
    try {
        const chefId = req.user?.id

        if (!chefId) {
            cleanupUploadedFiles(req.files)
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const existingRegistration = await chefRegister.findOne({ createdBy: chefId })

        if (existingRegistration) {
            cleanupUploadedFiles(req.files)
            return res.status(409).json({ message: 'Chef registration already exists' })
        }

        const {
            name,
            email,
            phone,
            kitchenName,
            cuisine,
            speciality,
            experience,
            maxOrders,
            addressLine,
            city,
            state,
            zip,
            nearestStation,
            prepTime,
            openTime,
            closeTime,
            availableDays,
            upiOrAccount,
            accountHolder,
            bankName,
            ifscCode,
        } = req.body

        const idProofFile = req.files?.idProof?.[0]
        const chefPhotoFile = req.files?.chefPhoto?.[0]

        if (!idProofFile || !chefPhotoFile) {
            cleanupUploadedFiles(req.files)
            return res.status(400).json({ message: 'Please upload both ID Proof and Chef Photo in PNG, JPG or JPEG format.' })
        }

        const duplicateChef = await chefAuth.findOne({
            email,
            _id: { $ne: chefId },
        })

        if (duplicateChef) {
            cleanupUploadedFiles(req.files)
            return res.status(409).json({ message: 'Email already in use' })
        }

        const existingChef = await chefAuth.findById(chefId)

        if (!existingChef) {
            cleanupUploadedFiles(req.files)
            return res.status(404).json({ message: 'Chef not found' })
        }

        let parsedAvailableDays = []
        if (Array.isArray(availableDays)) {
            parsedAvailableDays = availableDays
        } else if (typeof availableDays === 'string' && availableDays.trim()) {
            try {
                parsedAvailableDays = JSON.parse(availableDays)
            } catch (parseError) {
                parsedAvailableDays = availableDays.split(',').map((day) => day.trim()).filter(Boolean)
            }
        }

        const registration = await chefRegister.create({
            createdBy: chefId,
            kitchenName,
            cuisine,
            speciality,
            experience,
            maxOrders,
            addressLine,
            city,
            state,
            zip,
            nearestStation,
            prepTime,
            openTime,
            closeTime,
            availableDays: parsedAvailableDays,
            idProof: `/uploads/chef-register/${idProofFile.filename}`,
            chefPhoto: `/uploads/chef-register/${chefPhotoFile.filename}`,
            upiOrAccount: encryptField(upiOrAccount),
            accountHolder: encryptField(accountHolder),
            bankName: encryptField(bankName),
            ifscCode: encryptField(ifscCode),
        })

        const updatedChef = await chefAuth.findByIdAndUpdate(
            chefId,
            {
                name,
                email,
                phone,
                isRegistered: true,
            },
            {
                new: true,
                runValidators: true,
            },
        )

        const Cheftoken = generateToken({
            id: updatedChef._id,
            name: updatedChef.name,
            email: updatedChef.email,
            phone: updatedChef.phone,
            isRegistered: updatedChef.isRegistered,
        })

        res.cookie('chefToken', Cheftoken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1 * 24 * 60 * 60 * 1000,
        })

        return res.status(201).json({
            message: 'Chef registered successfully',
            chefUser: updatedChef,
            registration,
            token,
        })
    } catch (err) {
        cleanupUploadedFiles(req.files)

        if (err?.code === 11000) {
            return res.status(409).json({ message: 'Chef registration already exists' })
        }

        console.error('Error occurred while createChefRegister in chefRegister controller:', err.message)
        return res.status(500).json({ message: 'Server error' })
    }
}

module.exports = {
    createChefRegister,
}
