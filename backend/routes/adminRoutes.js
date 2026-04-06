const express = require('express')
const { signIn, signUp } = require('../controllers/adminAuth')
const { checkForUserAuth } = require('../middleware/userAuth')
const {
  getChefApprovals,
  approveChefApproval,
  rejectChefApproval,
} = require('../controllers/adminApproval')

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', signIn)

router.get('/me', checkForUserAuth('adminToken'), (req, res) => {
  res.status(200).json({ adminUser: req.user })
})

router.get('/dashboard', checkForUserAuth('adminToken'), (req, res) => {
  res.status(200).json({ message: 'Dashboard access granted', adminUser: req.user })
})

router.get('/chef-approvals', checkForUserAuth('adminToken'), getChefApprovals)
router.patch('/chef-approvals/:id/approve', checkForUserAuth('adminToken'), approveChefApproval)
router.patch('/chef-approvals/:id/reject', checkForUserAuth('adminToken'), rejectChefApproval)

module.exports = router
