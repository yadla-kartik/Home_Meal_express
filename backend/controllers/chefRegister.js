const chefAuth = require('../models/chefAuth')
const chefRegister = require('../models/chefRegister')
const { generateToken } = require('../utils/jwtAuth')
const { encryptField } = require('../utils/fieldCrypto')
const { emitToAdmins, emitToChef } = require('../socket')
const { serializeChefApproval } = require('../utils/chefApprovalPayload')
const { uploadImageBuffer } = require('../utils/cloudinary')
const { buildAuthCookieOptions } = require('../utils/authCookies')

const CHEF_COOKIE_MAX_AGE = 1 * 24 * 60 * 60 * 1000

const createChefRegister = async (req, res) => {
    try {
        const chefId = req.user?.id

        if (!chefId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const existingRegistration = await chefRegister.findOne({ createdBy: chefId })

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
            idType,
            idNumber,
            upiOrAccount,
            accountHolder,
            bankName,
            ifscCode,
        } = req.body

        const idProofFile = req.files?.idProof?.[0]
        const chefPhotoFile = req.files?.chefPhoto?.[0]
        const kitchenPhotoFile = req.files?.kitchenPhoto?.[0]

        if (!idProofFile || !chefPhotoFile || !kitchenPhotoFile) {
            return res.status(400).json({ message: 'Please upload ID Proof, Chef Photo and Kitchen Photo in PNG, JPG or JPEG format.' })
        }

        const normalizedIdType = typeof idType === 'string' ? idType.trim().toLowerCase() : ''
        const normalizedIdNumber = typeof idNumber === 'string' ? idNumber.trim().toUpperCase() : ''

        if (!['aadhaar', 'pan'].includes(normalizedIdType)) {
            return res.status(400).json({ message: 'Please select a valid ID type.' })
        }

        if (normalizedIdType === 'aadhaar' && !/^\d{12}$/.test(normalizedIdNumber)) {
            return res.status(400).json({ message: 'Aadhaar number must be exactly 12 digits.' })
        }

        if (normalizedIdType === 'pan' && !/^[A-Z]{5}\d{4}[A-Z]$/.test(normalizedIdNumber)) {
            return res.status(400).json({ message: 'PAN must follow format: 5 letters, 4 digits, 1 letter.' })
        }

        const duplicateChef = await chefAuth.findOne({
            email,
            _id: { $ne: chefId },
        })

        if (duplicateChef) {
            return res.status(409).json({ message: 'Email already in use' })
        }

        const existingChef = await chefAuth.findById(chefId)

        if (!existingChef) {
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

        const [idProofUrl, chefPhotoUrl, kitchenPhotoUrl] = await Promise.all([
            uploadImageBuffer({ file: idProofFile, folder: 'home-meal-express/chef-register' }),
            uploadImageBuffer({ file: chefPhotoFile, folder: 'home-meal-express/chef-register' }),
            uploadImageBuffer({ file: kitchenPhotoFile, folder: 'home-meal-express/chef-register' }),
        ])

        const nextRegistrationPayload = {
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
            idProof: idProofUrl,
            idType: normalizedIdType,
            idNumber: encryptField(normalizedIdNumber),
            chefPhoto: chefPhotoUrl,
            kitchenPhoto: kitchenPhotoUrl,
            upiOrAccount: encryptField(upiOrAccount),
            accountHolder: encryptField(accountHolder),
            bankName: encryptField(bankName),
            ifscCode: encryptField(ifscCode),
            isActive: false,
            reviewStatus: 'pending',
            reviewedAt: null,
            rejectionReason: '',
        }

        let registration

        if (existingRegistration) {
            if (existingRegistration.reviewStatus !== 'rejected') {
                return res.status(409).json({ message: 'Chef registration already exists' })
            }

            registration = await chefRegister.findByIdAndUpdate(
                existingRegistration._id,
                nextRegistrationPayload,
                {
                    new: true,
                    runValidators: true,
                },
            )
        } else {
            registration = await chefRegister.create({
                createdBy: chefId,
                ...nextRegistrationPayload,
            })
        }

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

        res.cookie('chefToken', Cheftoken, buildAuthCookieOptions(CHEF_COOKIE_MAX_AGE))

        return res.status(201).json({
            message: existingRegistration ? 'Chef registration resubmitted successfully' : 'Chef registered successfully',
            chefUser: updatedChef,
            registration,
            token: Cheftoken,
        })
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({ message: 'Chef registration already exists' })
        }

        console.error('Error occurred while createChefRegister in chefRegister controller:', err.message)
        return res.status(500).json({ message: 'Server error' })
    }
}

const createChefRegisterAndBroadcast = async (req, res) => {
    const originalJson = res.json.bind(res)

    res.json = (payload) => {
        if (res.statusCode === 201 && payload?.registration) {
            const plainRegistration = typeof payload.registration?.toObject === 'function'
                ? payload.registration.toObject()
                : payload.registration
            const approvalPayload = serializeChefApproval({
                ...plainRegistration,
                createdBy: payload.chefUser,
            })
            emitToAdmins('chef:approval-created', approvalPayload)
            emitToChef(approvalPayload.chef?.id, 'chef:review-status', approvalPayload)
        }

        return originalJson(payload)
    }

    return createChefRegister(req, res)
}

const getChefReviewStatus = async (req, res) => {
    try {
        const chefId = req.user?.id

        if (!chefId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const registration = await chefRegister.findOne({ createdBy: chefId })

        if (!registration) {
            return res.status(200).json({
                hasRegistration: false,
                reviewStatus: 'pending',
                isActive: false,
                rejectionReason: '',
            })
        }

        return res.status(200).json({
            hasRegistration: true,
            reviewStatus: registration.reviewStatus || 'pending',
            isActive: Boolean(registration.isActive),
            rejectionReason: registration.rejectionReason || '',
            reviewedAt: registration.reviewedAt || null,
        })
    } catch (err) {
        console.error('Error occurred while getChefReviewStatus in chefRegister controller:', err.message)
        return res.status(500).json({ message: 'Server error' })
    }
}

module.exports = {
    createChefRegister: createChefRegisterAndBroadcast,
    getChefReviewStatus,
}
