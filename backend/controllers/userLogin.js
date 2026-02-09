const user = require('../models/user')
const { generateToken } = require('../utils/jwtAuth')

const login = async (req, res) => {
  try {
    const { name, mobileNo, country } = req.body

    let findUser = await user.findOne({ mobileNo })

    if (!findUser) {
      findUser = await user.create({
        name,
        mobileNo,
        country,
      })
    }

    const token = generateToken({
      id: findUser._id,
      name: findUser.name,
      mobileNo: findUser.mobileNo,
      country: findUser.country,
    })

    res.cookie('UserToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      message: 'Login Successful',
      user: findUser,
      token: token,
    })
  } catch (err) {
    console.error('Error occurred while login in(userLogin controller file):', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = login
