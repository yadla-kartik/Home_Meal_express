const user = require('../models/user')
const { generateToken } = require('../utils/jwtAuth')
const { buildAuthCookieOptions } = require('../utils/authCookies')

const login = async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim()
    const mobileNo = String(req.body?.mobileNo || '').replace(/\D/g, '').slice(0, 10)
    const email = String(req.body?.email || '').trim().toLowerCase()
    const country = String(req.body?.country || '+91').trim() || '+91'

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' })
    }

    if (!email && (!mobileNo || mobileNo.length !== 10)) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit mobile number.' })
    }

    let findUser = null

    if (email) {
      findUser = await user.findOne({ email })
    }

    if (!findUser) {
      findUser = await user.findOne({ mobileNo })
    }

    if (!findUser) {
      findUser = await user.create({
        name,
        mobileNo: mobileNo || undefined,
        country,
        email: email || undefined,
      })
    } else {
      findUser.name = name || findUser.name
      if (mobileNo) {
        findUser.mobileNo = mobileNo
      }
      findUser.country = country || findUser.country
      if (email) {
        findUser.email = email
      }

      await findUser.save()
    }

    const token = generateToken({
      id: findUser._id,
      name: findUser.name,
      mobileNo: findUser.mobileNo,
      country: findUser.country,
      email: findUser.email,
    })

    res.cookie('UserToken', token, buildAuthCookieOptions(7 * 24 * 60 * 60 * 1000))

    return res.status(200).json({
      success: true,
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
