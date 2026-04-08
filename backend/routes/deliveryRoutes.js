const express = require('express')
const { login, logout } = require('../controllers/deliveryLogin')
const { checkForDeliveryAuth } = require('../middleware/deliveryAuth')
const { createDeliveryRegister, getDeliveryReviewStatus } = require('../controllers/deliveryRegister')
const { uploadDeliveryRegister } = require('../middleware/deliveryRegisterUpload')

const router = express.Router()

router.post('/', login)
router.post('/logout', checkForDeliveryAuth, logout)
router.post('/register', checkForDeliveryAuth, uploadDeliveryRegister, createDeliveryRegister)
router.get('/review-status', checkForDeliveryAuth, getDeliveryReviewStatus)

router.get('/me', checkForDeliveryAuth, (req, res) => {
  res.status(200).json({ deliveryBoy: req.user })
})

router.get('/dashboard', checkForDeliveryAuth, (req, res) => {
  res.status(200).json({ message: 'Dashboard access granted', deliveryBoy: req.user })
})

module.exports = router
