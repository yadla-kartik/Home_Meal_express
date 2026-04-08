const fs = require('fs')
const path = require('path')
const deliveryAuth = require('../models/deliveryAuth')
const deliveryRegister = require('../models/deliveryRegister')

const cleanupUploadedFiles = (files = {}) => {
  Object.values(files)
    .flat()
    .forEach((file) => {
      if (!file?.path) return

      const absolutePath = path.resolve(file.path)
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath)
      }
    })
}

const createDeliveryRegister = async (req, res) => {
  try {
    const deliveryBoyId = req.user?.id

    if (!deliveryBoyId) {
      cleanupUploadedFiles(req.files)
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const existingRegistration = await deliveryRegister.findOne({ createdBy: deliveryBoyId })

    const {
      name,
      mobileNo,
      email,
      idType,
      idNumber,
      vehicleType,
      vehicleNumber,
      drivingLicenseNumber,
      address,
      city,
      state,
      pincode,
      nearestStation,
      availableDays,
      startTime,
      endTime,
      upiId,
      accountNumber,
      ifscCode,
      accountHolderName,
    } = req.body

    const profilePhotoFile = req.files?.profilePhoto?.[0]
    const idProofImageFile = req.files?.idProofImage?.[0]

    if (!profilePhotoFile || !idProofImageFile) {
      cleanupUploadedFiles(req.files)
      return res.status(400).json({ message: 'Please upload both Profile Photo and ID Proof Image.' })
    }

    const normalizedIdType = typeof idType === 'string' ? idType.trim().toLowerCase() : ''
    const normalizedIdNumber = typeof idNumber === 'string' ? idNumber.trim().toUpperCase() : ''
    const normalizedVehicleNumber = typeof vehicleNumber === 'string' ? vehicleNumber.trim().toUpperCase() : ''
    const normalizedLicense = typeof drivingLicenseNumber === 'string' ? drivingLicenseNumber.trim().toUpperCase() : ''
    const normalizedIfsc = typeof ifscCode === 'string' ? ifscCode.trim().toUpperCase() : ''

    if (!['aadhaar', 'pan'].includes(normalizedIdType)) {
      cleanupUploadedFiles(req.files)
      return res.status(400).json({ message: 'Please select a valid ID type.' })
    }

    if (normalizedIdType === 'aadhaar' && !/^\d{12}$/.test(normalizedIdNumber)) {
      cleanupUploadedFiles(req.files)
      return res.status(400).json({ message: 'Aadhaar number must be exactly 12 digits.' })
    }

    if (normalizedIdType === 'pan' && !/^[A-Z]{5}\d{4}[A-Z]$/.test(normalizedIdNumber)) {
      cleanupUploadedFiles(req.files)
      return res.status(400).json({ message: 'PAN must follow format: 5 letters, 4 digits, 1 letter.' })
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

    const nextPayload = {
      name,
      mobileNo,
      email,
      profilePhoto: `/uploads/delivery-register/${profilePhotoFile.filename}`,
      idType: normalizedIdType,
      idNumber: normalizedIdNumber,
      idProofImage: `/uploads/delivery-register/${idProofImageFile.filename}`,
      vehicleType,
      vehicleNumber: normalizedVehicleNumber,
      drivingLicenseNumber: normalizedLicense,
      address,
      city,
      state,
      pincode: Number(pincode),
      nearestStation,
      availableDays: parsedAvailableDays,
      startTime,
      endTime,
      upiId,
      accountNumber,
      ifscCode: normalizedIfsc,
      accountHolderName,
      status: 'pending',
      rejectionReason: '',
      isOnline: false,
    }

    let registration

    if (existingRegistration) {
      if (existingRegistration.status !== 'rejected') {
        cleanupUploadedFiles(req.files)
        return res.status(409).json({ message: 'Delivery registration already exists' })
      }

      const oldFiles = {
        profilePhoto: existingRegistration.profilePhoto,
        idProofImage: existingRegistration.idProofImage,
      }

      registration = await deliveryRegister.findByIdAndUpdate(existingRegistration._id, nextPayload, {
        new: true,
        runValidators: true,
      })

      ;[oldFiles.profilePhoto, oldFiles.idProofImage].forEach((filePath) => {
        if (!filePath) return
        const absolutePath = path.resolve(`.${filePath}`)
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath)
        }
      })
    } else {
      registration = await deliveryRegister.create({
        createdBy: deliveryBoyId,
        ...nextPayload,
      })
    }

    const updatedDeliveryBoy = await deliveryAuth.findByIdAndUpdate(
      deliveryBoyId,
      {
        name,
        mobileNo,
        isRegistered: true,
      },
      { new: true, runValidators: true },
    )

    return res.status(201).json({
      message: existingRegistration
        ? 'Delivery registration resubmitted successfully'
        : 'Delivery registered successfully',
      deliveryBoy: updatedDeliveryBoy,
      registration,
    })
  } catch (err) {
    cleanupUploadedFiles(req.files)

    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Delivery registration already exists' })
    }

    console.error('Error occurred while createDeliveryRegister in deliveryRegister controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

const getDeliveryReviewStatus = async (req, res) => {
  try {
    const deliveryBoyId = req.user?.id

    if (!deliveryBoyId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const registration = await deliveryRegister.findOne({ createdBy: deliveryBoyId })

    if (!registration) {
      return res.status(200).json({
        hasRegistration: false,
        status: 'pending',
        rejectionReason: '',
      })
    }

    return res.status(200).json({
      hasRegistration: true,
      status: registration.status || 'pending',
      rejectionReason: registration.rejectionReason || '',
    })
  } catch (err) {
    console.error('Error occurred while getDeliveryReviewStatus in deliveryRegister controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  createDeliveryRegister,
  getDeliveryReviewStatus,
}
