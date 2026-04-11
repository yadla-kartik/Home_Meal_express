const mongoose = require('mongoose')

const userOtpSchema = new mongoose.Schema(
  {
    mobileNo: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: '+91',
    },
    otpHash: {
      type: String,
      required: true,
    },
    attemptsLeft: {
      type: Number,
      default: 5,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('userOtp', userOtpSchema)
