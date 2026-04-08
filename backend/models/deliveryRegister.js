const mongoose = require('mongoose')

const deliveryRegisterSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'deliveryAuth',
      required: true,
      unique: true,
    },
    name: String,
    mobileNo: String,
    email: String,

    profilePhoto: String,

    idType: String,
    idNumber: String,
    idProofImage: String,

    vehicleType: String,
    vehicleNumber: String,
    drivingLicenseNumber: String,

    address: String,
    city: String,
    state: String,
    pincode: Number,
    nearestStation: String,

    availableDays: [String],
    startTime: String,
    endTime: String,

    upiId: String,
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    rejectionReason: {
      type: String,
      default: '',
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('deliveryRegister', deliveryRegisterSchema)
