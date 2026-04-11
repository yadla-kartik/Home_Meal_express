const jwt = require('jsonwebtoken')

const generateToken = (payload, expiresIn = '1d') => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
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
