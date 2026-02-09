const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
  return token
}

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (err) {
    console.log('Error occured in verifyToken', err)
    return null
  }
}

module.exports = { generateToken, verifyToken }
