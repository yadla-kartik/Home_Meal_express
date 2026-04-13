const express = require('express')
const { signIn, signUp } = require('../controllers/adminAuth')
const adminAuth = require('../models/adminAuth')
const { checkForUserAuth } = require('../middleware/userAuth')
const {
  getChefApprovals,
  approveChefApproval,
  rejectChefApproval,
} = require('../controllers/adminApproval')

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', signIn)
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    sameSite: 'lax',
  })

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

module.exports = router
