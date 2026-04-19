const deliveryAuth = require('../models/deliveryAuth')
const { generateToken } = require('../utils/jwtAuth')
const { buildAuthCookieOptions, buildClearCookieOptions } = require('../utils/authCookies')

const DELIVERY_COOKIE_MAX_AGE = 1 * 24 * 60 * 60 * 1000

const login = async (req, res) => {
  try {
    const { name, mobileNo } = req.body

    let findDeliveryBoy = await deliveryAuth.findOne({ mobileNo })

    if (!findDeliveryBoy) {
      findDeliveryBoy = await deliveryAuth.create({
        name,
        mobileNo,
      })
    } else if (name && findDeliveryBoy.name !== name) {
      findDeliveryBoy.name = name
    }

    await findDeliveryBoy.save()

    const token = generateToken({
      id: findDeliveryBoy._id,
      name: findDeliveryBoy.name,
      mobileNo: findDeliveryBoy.mobileNo,
      isRegistered: findDeliveryBoy.isRegistered,
    })

    res.cookie('DeliveryToken', token, buildAuthCookieOptions(DELIVERY_COOKIE_MAX_AGE))

    return res.status(200).json({
      success: true,
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
    res.clearCookie('DeliveryToken', buildClearCookieOptions())

    return res.status(200).json({ success: true, message: 'Logout successful' })
  } catch (err) {
    console.error('Error occurred while logout in(deliveryLogin controller file):', err.message)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

module.exports = {
  login,
  logout,
}
