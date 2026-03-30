const express = require('express')
const login = require('../controllers/deliveryLogin')
const { checkForUserAuth } = require('../middleware/userAuth')

const router = express.Router()

router.post('/', login)

router.get('/me', checkForUserAuth('DeliveryToken'), (req, res) => {
  res.status(200).json({ deliveryBoy: req.user })
})

router.get('/dashboard', checkForUserAuth('DeliveryToken'), (req, res) => {
  res.status(200).json({ message: 'Dashboard access granted', deliveryBoy: req.user })
})

module.exports = router
