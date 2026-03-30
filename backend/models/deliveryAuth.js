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
    }
})

module.exports = mongoose.model('deliveryAuth', deliveryAuthSchema)
