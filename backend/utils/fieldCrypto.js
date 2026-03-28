const crypto = require('crypto')

const ENCRYPTION_SECRET = process.env.FIELD_ENCRYPTION_SECRET || process.env.JWT_SECRET || 'home-meal-express-secret'

function encryptField(value) {
  if (value === undefined || value === null || value === '') {
    return value
  }

  const salt = crypto.randomBytes(16)
  const iv = crypto.randomBytes(16)
  const key = crypto.scryptSync(ENCRYPTION_SECRET, salt, 32)
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

  const encrypted = `${cipher.update(String(value), 'utf8', 'hex')}${cipher.final('hex')}`
  return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}`
}

module.exports = {
  encryptField,
}
