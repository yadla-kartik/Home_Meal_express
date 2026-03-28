const chefAuth = require('../models/chefAuth')
const chefRegister = require('../models/chefRegister')
const { generateToken } = require('../utils/jwtAuth')
const { encryptField } = require('../utils/fieldCrypto')

const createChefRegister = async (req, res) => {
    try {
        const chefId = req.user?.id

        if (!chefId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const existingRegistration = await chefRegister.findOne({ createdBy: chefId })

        if (existingRegistration) {
            return res.status(409).json({ message: 'Chef registration already exists' })
        }

        const {
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
            idProof,
            chefPhoto,
            upiOrAccount,
            accountHolder,
            bankName,
            ifscCode,
        } = req.body

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
            availableDays,
            idProof: encryptField(idProof),
            chefPhoto: encryptField(chefPhoto),
            upiOrAccount: encryptField(upiOrAccount),
            accountHolder: encryptField(accountHolder),
            bankName: encryptField(bankName),
            ifscCode: encryptField(ifscCode),
        })

        const updatedChef = await chefAuth.findByIdAndUpdate(
            chefId,
            { isRegistered: true },
            { new: true },
        )

        const token = generateToken({
            id: updatedChef._id,
            name: updatedChef.name,
            email: updatedChef.email,
            phone: updatedChef.phone,
            isRegistered: updatedChef.isRegistered,
        })

        res.cookie('chefToken', token, {
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
