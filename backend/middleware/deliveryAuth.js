const deliveryAuth = require('../models/deliveryAuth')
const { verifyToken } = require('../utils/jwtAuth')

async function checkForDeliveryAuth(req, res, next) {
  const tokenValue = req.cookies.DeliveryToken

  if (!tokenValue) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const userPayload = verifyToken(tokenValue)
  if (!userPayload?.id || !userPayload?.sessionId) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const deliveryBoy = await deliveryAuth.findById(userPayload.id)
  if (!deliveryBoy) {
    return res.status(401).json({ message: 'Delivery partner not found' })
  }

  const isExpired =
    !deliveryBoy.activeSessionExpiresAt || new Date(deliveryBoy.activeSessionExpiresAt).getTime() <= Date.now()

  if (isExpired) {
    if (deliveryBoy.activeSessionId || deliveryBoy.activeSessionExpiresAt) {
      deliveryBoy.activeSessionId = ''
      deliveryBoy.activeSessionExpiresAt = null
      await deliveryBoy.save()
    }

    res.clearCookie('DeliveryToken', {
      httpOnly: true,
      sameSite: 'lax',
    })
    return res.status(401).json({ message: 'Session expired, please login again' })
  }

  if (deliveryBoy.activeSessionId !== userPayload.sessionId) {
    res.clearCookie('DeliveryToken', {
      httpOnly: true,
      sameSite: 'lax',
    })
    return res.status(401).json({ message: 'This account is active on another device' })
  }

  req.user = {
    id: String(deliveryBoy._id),
    name: deliveryBoy.name,
    mobileNo: deliveryBoy.mobileNo,
    isRegistered: Boolean(deliveryBoy.isRegistered),
    sessionId: deliveryBoy.activeSessionId,
  }

  return next()
}

module.exports = {
  checkForDeliveryAuth,
}
