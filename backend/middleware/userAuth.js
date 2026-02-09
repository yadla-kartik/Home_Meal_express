const { verifyToken } = require('../utils/jwtAuth')

function checkForUserAuth(cookieName) {
  return (req, res, next) => {
    const tokenValue = req.cookies[cookieName]

    if (!tokenValue) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const userPayload = verifyToken(tokenValue)
    if (!userPayload) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = userPayload
    return next()
  }
}

module.exports = {
  checkForUserAuth,
}
