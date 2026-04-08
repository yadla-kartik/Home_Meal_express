const mongoose = require('mongoose');

const deliveryAuthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  isRegistered: {
    default: false,
    type: Boolean,
  },
  activeSessionId: {
    type: String,
    default: '',
  },
  activeSessionExpiresAt: {
    type: Date,
    default: null,
  },
  lastLoginAt: {
    type: Date,
    default: null,
  },
})

module.exports = mongoose.model('deliveryAuth', deliveryAuthSchema)
