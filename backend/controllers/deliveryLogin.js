const deliveryAuth = require('../models/deliveryAuth')
const { generateToken } = require('../utils/jwtAuth')
const { verifyToken } = require('../utils/jwtAuth')
const { randomUUID } = require('crypto')

const login = async (req, res) => {
  try {
    const { name, mobileNo } = req.body
    const now = Date.now()

    let findDeliveryBoy = await deliveryAuth.findOne({ mobileNo })

    if (!findDeliveryBoy) {
      findDeliveryBoy = await deliveryAuth.create({
        name,
        mobileNo,
      })
    } else if (name && findDeliveryBoy.name !== name) {
      findDeliveryBoy.name = name
    }

    const currentToken = req.cookies?.DeliveryToken
    const decodedCurrentToken = currentToken ? verifyToken(currentToken) : null
    const hasActiveSession =
      Boolean(findDeliveryBoy.activeSessionId) &&
      Boolean(findDeliveryBoy.activeSessionExpiresAt) &&
      new Date(findDeliveryBoy.activeSessionExpiresAt).getTime() > now

    const isSameActiveSession =
      hasActiveSession &&
      decodedCurrentToken?.id === String(findDeliveryBoy._id) &&
      decodedCurrentToken?.sessionId === findDeliveryBoy.activeSessionId

    if (hasActiveSession && !isSameActiveSession) {
      return res.status(409).json({
        message: 'This mobile number is already logged in on another device',
      })
    }

    const nextSessionId = isSameActiveSession ? findDeliveryBoy.activeSessionId : randomUUID()
    const nextSessionExpiry = new Date(now + 24 * 60 * 60 * 1000)

    findDeliveryBoy.activeSessionId = nextSessionId
    findDeliveryBoy.activeSessionExpiresAt = nextSessionExpiry
    findDeliveryBoy.lastLoginAt = new Date(now)
    await findDeliveryBoy.save()

    const token = generateToken({
      id: findDeliveryBoy._id,
      name: findDeliveryBoy.name,
      mobileNo: findDeliveryBoy.mobileNo,
      isRegistered: findDeliveryBoy.isRegistered,
      sessionId: nextSessionId,
    })

    res.cookie('DeliveryToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      message: 'Login Successful',
      deliveryBoy: findDeliveryBoy,
      token,
    })
  } catch (err) {
    console.error('Error occurred while login in(deliveryLogin controller file):', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

const logout = async (req, res) => {
  try {
    const currentToken = req.cookies?.DeliveryToken
    const decodedCurrentToken = currentToken ? verifyToken(currentToken) : null

    if (decodedCurrentToken?.id) {
      const deliveryBoy = await deliveryAuth.findById(decodedCurrentToken.id)

      if (deliveryBoy && deliveryBoy.activeSessionId === decodedCurrentToken.sessionId) {
        deliveryBoy.activeSessionId = ''
        deliveryBoy.activeSessionExpiresAt = null
        await deliveryBoy.save()
      }
    }

    res.clearCookie('DeliveryToken', {
      httpOnly: true,
      sameSite: 'lax',
    })

    return res.status(200).json({ message: 'Logout successful' })
  } catch (err) {
    console.error('Error occurred while logout in(deliveryLogin controller file):', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  login,
  logout,
}
