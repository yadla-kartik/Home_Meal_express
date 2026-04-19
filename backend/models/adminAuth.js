const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const isBcryptHash = (value) => /^\$2[aby]\$\d{2}\$/.test(String(value || ''))

const AdminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    adminCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    onboardingEmailSentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
)

AdminSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return
  }

  if (isBcryptHash(this.password)) {
    return
  }

  this.password = await bcrypt.hash(this.password, 10)
})

AdminSchema.methods.comparePassword = async function comparePassword(enteredPassword) {
  const candidate = String(enteredPassword || '')

  if (isBcryptHash(this.password)) {
    return bcrypt.compare(candidate, this.password)
  }

  return this.password === candidate
}

module.exports = mongoose.model('adminAuth', AdminSchema)
