const express = require('express')
const login = require('../controllers/userLogin')
const { sendOtp, verifyOtp, verifyAccessToken, checkPnr } = require('../controllers/userOtpAuth')
const {
  getJourneySummary,
  getStationChefs,
  getChefMenuForStation,
  createJourneyOrder,
} = require('../controllers/userJourney')
const { checkForUserAuth } = require('../middleware/userAuth')
const { buildClearCookieOptions } = require('../utils/authCookies')

const router = express.Router()

// Login route user create krne wala
router.post('/', login)

router.post('/otp/send', sendOtp)
router.post('/otp/verify', verifyOtp)
router.post('/otp/verify-access-token', verifyAccessToken)
router.post('/pnr/check', checkPnr)
router.post('/pnr/journey-summary', checkForUserAuth('UserToken'), getJourneySummary)
router.get('/stations/:stationCode/chefs', checkForUserAuth('UserToken'), getStationChefs)
router.get('/stations/:stationCode/chefs/:chefId/menu', checkForUserAuth('UserToken'), getChefMenuForStation)
router.post('/orders', checkForUserAuth('UserToken'), createJourneyOrder)

router.get('/me', checkForUserAuth('UserToken'), (req, res) => {
  res.status(200).json({ user: req.user })
})

router.post('/logout', (req, res) => {
  res.clearCookie('UserToken', buildClearCookieOptions())
  res.status(200).json({ success: true, message: 'Logged out successfully' })
})

// Example protected endpoint for dashboard data
router.get('/dashboard', checkForUserAuth('UserToken'), (req, res) => {
  res.status(200).json({ message: 'Dashboard access granted', user: req.user })
})

module.exports = router
