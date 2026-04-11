const express = require('express')
const login = require('../controllers/userLogin')
const { sendOtp, verifyOtp, verifyAccessToken } = require('../controllers/userOtpAuth')
const { checkForUserAuth } = require('../middleware/userAuth')

const router = express.Router()

// Login route user create krne wala
router.post('/', login)

router.post('/otp/send', sendOtp)
router.post('/otp/verify', verifyOtp)
router.post('/otp/verify-access-token', verifyAccessToken)

router.get('/me', checkForUserAuth('UserToken'), (req, res) => {
  res.status(200).json({ user: req.user })
})

// Example protected endpoint for dashboard data
router.get('/dashboard', checkForUserAuth('UserToken'), (req, res) => {
  res.status(200).json({ message: 'Dashboard access granted', user: req.user })
})

module.exports = router
