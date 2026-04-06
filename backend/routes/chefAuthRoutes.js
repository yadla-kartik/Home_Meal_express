const express = require('express')
const { checkForUserAuth } = require('../middleware/userAuth')
const { signIn, signUp } = require('../controllers/chefAuth')
const { createChefRegister, getChefReviewStatus } = require('../controllers/chefRegister')
const { uploadChefRegister } = require('../middleware/chefRegisterUpload')

const router = express.Router()

// Login and Sign up Routes
router.post('/login', signIn)
router.post('/signup', signUp)

// Register Routes
// router.put('/profile', checkForUserAuth('chefToken'), updateProfile)
router.post('/register', checkForUserAuth('chefToken'), uploadChefRegister, createChefRegister)
router.get('/review-status', checkForUserAuth('chefToken'), getChefReviewStatus)

router.get('/me', checkForUserAuth('chefToken'), (req, res) => {
  res.status(200).json({ chefUser: req.user })
})

router.get('/dashboard', checkForUserAuth('chefToken'), (req, res) => {
  res.status(200).json({ message: 'Dashboard access granted', chefUser: req.user })
})

module.exports = router
