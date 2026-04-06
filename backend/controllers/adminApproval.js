const chefRegister = require('../models/chefRegister')
const { emitToAdmins } = require('../socket')
const { serializeChefApproval } = require('../utils/chefApprovalPayload')

const CHEF_POPULATE = 'createdBy'
const CHEF_SELECT = 'name email phone isRegistered'

const getChefApprovals = async (req, res) => {
  try {
    const requestedStatus = req.query.status || 'pending'
    const filter = {}

    if (requestedStatus !== 'all') {
      filter.reviewStatus = requestedStatus
    }

    const approvals = await chefRegister
      .find(filter)
      .populate(CHEF_POPULATE, CHEF_SELECT)
      .sort({ createdAt: -1 })

    return res.status(200).json({
      approvals: approvals.map(serializeChefApproval),
    })
  } catch (err) {
    console.error('Error occurred while getChefApprovals in adminApproval controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

const approveChefApproval = async (req, res) => {
  try {
    const approval = await chefRegister
      .findByIdAndUpdate(
        req.params.id,
        {
          isActive: true,
          reviewStatus: 'approved',
          reviewedAt: new Date(),
          rejectionReason: '',
        },
        { new: true },
      )
      .populate(CHEF_POPULATE, CHEF_SELECT)

    if (!approval) {
      return res.status(404).json({ message: 'Chef approval request not found' })
    }

    const payload = serializeChefApproval(approval)
    emitToAdmins('chef:approval-updated', payload)

    return res.status(200).json({
      message: 'Chef approved successfully',
      approval: payload,
    })
  } catch (err) {
    console.error('Error occurred while approveChefApproval in adminApproval controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

const rejectChefApproval = async (req, res) => {
  try {
    const rejectionReason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : ''

    const approval = await chefRegister
      .findByIdAndUpdate(
        req.params.id,
        {
          isActive: false,
          reviewStatus: 'rejected',
          reviewedAt: new Date(),
          rejectionReason,
        },
        { new: true },
      )
      .populate(CHEF_POPULATE, CHEF_SELECT)

    if (!approval) {
      return res.status(404).json({ message: 'Chef approval request not found' })
    }

    const payload = serializeChefApproval(approval)
    emitToAdmins('chef:approval-updated', payload)

    return res.status(200).json({
      message: 'Chef rejected successfully',
      approval: payload,
    })
  } catch (err) {
    console.error('Error occurred while rejectChefApproval in adminApproval controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getChefApprovals,
  approveChefApproval,
  rejectChefApproval,
}
