const express = require('express')
const { signIn, signUp, changePassword } = require('../controllers/adminAuth')
const adminAuth = require('../models/adminAuth')
const { checkForUserAuth } = require('../middleware/userAuth')
const { buildClearCookieOptions } = require('../utils/authCookies')
const {
  getChefApprovals,
  approveChefApproval,
  rejectChefApproval,
} = require('../controllers/adminApproval')
const {
  getDeliveryApprovals,
  approveDeliveryApproval,
  rejectDeliveryApproval,
} = require('../controllers/deliveryApproval')

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', signIn)
router.patch('/change-password', checkForUserAuth('adminToken'), changePassword)
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken', buildClearCookieOptions())

  res.status(200).json({ success: true, message: 'Logout successful' })
})

router.get('/me', checkForUserAuth('adminToken'), async (req, res) => {
  const adminId = req.user?.id

  if (!adminId) {
    return res.status(200).json({ adminUser: req.user })
  }

  const adminRecord = await adminAuth.findById(adminId).select('-password')

  if (!adminRecord) {
    return res.status(200).json({ adminUser: req.user })
  }

  res.status(200).json({ adminUser: adminRecord })
})

router.get('/dashboard', checkForUserAuth('adminToken'), (req, res) => {
  res.status(200).json({ message: 'Dashboard access granted', adminUser: req.user })
})

router.get('/chef-approvals', checkForUserAuth('adminToken'), getChefApprovals)
router.patch('/chef-approvals/:id/approve', checkForUserAuth('adminToken'), approveChefApproval)
router.patch('/chef-approvals/:id/reject', checkForUserAuth('adminToken'), rejectChefApproval)
router.get('/delivery-approvals', checkForUserAuth('adminToken'), getDeliveryApprovals)
router.patch('/delivery-approvals/:id/approve', checkForUserAuth('adminToken'), approveDeliveryApproval)
router.patch('/delivery-approvals/:id/reject', checkForUserAuth('adminToken'), rejectDeliveryApproval)

module.exports = router
