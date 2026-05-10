const deliveryRegister = require('../models/deliveryRegister')
const { emitToAdmins, emitToDelivery } = require('../socket')
const { serializeDeliveryApproval } = require('../utils/deliveryApprovalPayload')

const getDeliveryApprovals = async (req, res) => {
  try {
    const requestedStatus = req.query.status || 'pending'
    const query = requestedStatus === 'all' ? {} : { status: requestedStatus }

    const approvals = await deliveryRegister
      .find(query)
      .populate('createdBy', 'name mobileNo isRegistered')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      approvals: approvals.map(serializeDeliveryApproval),
    })
  } catch (err) {
    console.error('Error occurred while getDeliveryApprovals in deliveryApproval controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

const approveDeliveryApproval = async (req, res) => {
  try {
    const approval = await deliveryRegister
      .findByIdAndUpdate(
        req.params.id,
        {
          status: 'approved',
          reviewedAt: new Date(),
          rejectionReason: '',
        },
        { new: true, runValidators: true },
      )
      .populate('createdBy', 'name mobileNo isRegistered')

    if (!approval) {
      return res.status(404).json({ message: 'Delivery approval request not found' })
    }

    const payload = serializeDeliveryApproval(approval)
    emitToAdmins('delivery:approval-updated', payload)
    emitToDelivery(payload.deliveryBoy?.id, 'delivery:approval-updated', payload)
    emitToDelivery(payload.deliveryBoy?.id, 'delivery:review-status', payload)

    return res.status(200).json({
      message: 'Delivery partner approved successfully',
      approval: payload,
    })
  } catch (err) {
    console.error('Error occurred while approveDeliveryApproval in deliveryApproval controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

const rejectDeliveryApproval = async (req, res) => {
  try {
    const rejectionReason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : ''

    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' })
    }

    const approval = await deliveryRegister
      .findByIdAndUpdate(
        req.params.id,
        {
          status: 'rejected',
          reviewedAt: new Date(),
          rejectionReason,
        },
        { new: true, runValidators: true },
      )
      .populate('createdBy', 'name mobileNo isRegistered')

    if (!approval) {
      return res.status(404).json({ message: 'Delivery approval request not found' })
    }

    const payload = serializeDeliveryApproval(approval)
    emitToAdmins('delivery:approval-updated', payload)
    emitToDelivery(payload.deliveryBoy?.id, 'delivery:approval-updated', payload)
    emitToDelivery(payload.deliveryBoy?.id, 'delivery:review-status', payload)

    return res.status(200).json({
      message: 'Delivery partner rejected successfully',
      approval: payload,
    })
  } catch (err) {
    console.error('Error occurred while rejectDeliveryApproval in deliveryApproval controller:', err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getDeliveryApprovals,
  approveDeliveryApproval,
  rejectDeliveryApproval,
}
