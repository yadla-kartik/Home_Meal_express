const express = require('express')
const { checkForUserAuth } = require('../middleware/userAuth')
const { signIn, signUp, updateProfile } = require('../controllers/chefAuth')
const { createChefRegister } = require('../controllers/chefRegister')

const router = express.Router()

// Login and Sign up Routes
router.post('/login', signIn)
router.post('/signup', signUp)

// Register Routes
router.put('/profile', checkForUserAuth('chefToken'), updateProfile)
router.post('/register', checkForUserAuth('chefToken'), createChefRegister)

router.get('/me', checkForUserAuth('chefToken'), (req, res) => {
  res.status(200).json({ chefUser: req.user })
})

router.get('/dashboard', checkForUserAuth('chefToken'), (req, res) => {
  res.status(200).json({ message: 'Dashboard access granted', chefUser: req.user })
})

module.exports = router
