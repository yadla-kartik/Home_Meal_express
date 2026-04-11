const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
    default: null,
  },
  country: {
    type: String,
  },
})

module.exports = mongoose.model('user', userSchema)
