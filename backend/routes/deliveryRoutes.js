const express = require('express')
const { login, logout } = require('../controllers/deliveryLogin')
const { verifyAccessToken: verifyDeliveryAccessToken } = require('../controllers/deliveryOtpAuth')
const { checkForDeliveryAuth } = require('../middleware/deliveryAuth')
const { createDeliveryRegister, getDeliveryReviewStatus } = require('../controllers/deliveryRegister')
const {
  acceptDeliveryOrder,
  getAvailableDeliveryOrders,
  getDeliveryOrderById,
  markDeliveryOrderDelivered,
  markDeliveryOrderPickedUp,
} = require('../controllers/deliveryOrders')
const { uploadDeliveryRegister } = require('../middleware/deliveryRegisterUpload')

const router = express.Router()

router.post('/', login)
router.post('/otp/verify-access-token', verifyDeliveryAccessToken)
router.post('/logout', checkForDeliveryAuth, logout)
router.post('/register', checkForDeliveryAuth, uploadDeliveryRegister, createDeliveryRegister)
router.get('/review-status', checkForDeliveryAuth, getDeliveryReviewStatus)
router.get('/orders/available', checkForDeliveryAuth, getAvailableDeliveryOrders)
router.get('/orders/:orderId', checkForDeliveryAuth, getDeliveryOrderById)
router.patch('/orders/:orderId/accept', checkForDeliveryAuth, acceptDeliveryOrder)
router.patch('/orders/:orderId/picked-up', checkForDeliveryAuth, markDeliveryOrderPickedUp)
router.patch('/orders/:orderId/delivered', checkForDeliveryAuth, markDeliveryOrderDelivered)

router.get('/me', checkForDeliveryAuth, (req, res) => {
  res.status(200).json({ deliveryBoy: req.user })
})

router.get('/dashboard', checkForDeliveryAuth, (req, res) => {
  res.status(200).json({ message: 'Dashboard access granted', deliveryBoy: req.user })
})

module.exports = router
