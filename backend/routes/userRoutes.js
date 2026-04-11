const express = require('express')
const login = require('../controllers/userLogin')
const { sendOtp, verifyOtp, verifyAccessToken, checkPnr } = require('../controllers/userOtpAuth')
const { checkForUserAuth } = require('../middleware/userAuth')

const router = express.Router()

// Login route user create krne wala
router.post('/', login)

router.post('/otp/send', sendOtp)
router.post('/otp/verify', verifyOtp)
router.post('/otp/verify-access-token', verifyAccessToken)
router.post('/pnr/check', checkPnr)

router.get('/me', checkForUserAuth('UserToken'), (req, res) => {
  res.status(200).json({ user: req.user })
})

router.post('/logout', (req, res) => {
  res.clearCookie('UserToken')
  res.status(200).json({ success: true, message: 'Logged out successfully' })
})

// Example protected endpoint for dashboard data
router.get('/dashboard', checkForUserAuth('UserToken'), (req, res) => {
  res.status(200).json({ message: 'Dashboard access granted', user: req.user })
})

module.exports = router
