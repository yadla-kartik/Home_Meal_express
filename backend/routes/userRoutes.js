const express = require('express')
const login = require('../controllers/userLogin')
const { checkForUserAuth } = require('../middleware/userAuth')

const router = express.Router()

// Login route user create krne wala
router.post('/', login)

router.get('/me', checkForUserAuth('UserToken'), (req, res) => {
  res.status(200).json({ user: req.user })
})

// Example protected endpoint for dashboard data
router.get('/dashboard', checkForUserAuth('UserToken'), (req, res) => {
  res.status(200).json({ message: 'Dashboard access granted', user: req.user })
})

module.exports = router
