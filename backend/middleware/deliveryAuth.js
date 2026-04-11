const deliveryAuth = require('../models/deliveryAuth')
const { verifyToken } = require('../utils/jwtAuth')

async function checkForDeliveryAuth(req, res, next) {
  const tokenValue = req.cookies.DeliveryToken

  if (!tokenValue) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const userPayload = verifyToken(tokenValue)
  if (!userPayload?.id) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const deliveryBoy = await deliveryAuth.findById(userPayload.id)
  if (!deliveryBoy) {
    return res.status(401).json({ message: 'Delivery partner not found' })
  }

  req.user = {
    id: String(deliveryBoy._id),
    name: deliveryBoy.name,
    mobileNo: deliveryBoy.mobileNo,
    isRegistered: Boolean(deliveryBoy.isRegistered),
  }

  return next()
}

module.exports = {
  checkForDeliveryAuth,
}
