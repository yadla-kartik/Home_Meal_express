const deliveryAuth = require('../models/deliveryAuth')
const { generateToken } = require('../utils/jwtAuth')

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
      await findDeliveryBoy.save()
    }

    const token = generateToken({
      id: findDeliveryBoy._id,
      name: findDeliveryBoy.name,
      mobileNo: findDeliveryBoy.mobileNo,
      isRegistered: findDeliveryBoy.isRegistered,
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

module.exports = login
