const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    sparse: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
  },
  country: {
    type: String,
  },
})

module.exports = mongoose.model('user', userSchema)
