const mongoose = require('mongoose')
const userOrder = require('../models/userOrder')
const { emitToDelivery, emitToUser } = require('../socket')
const { mapDeliveryOrderPayload } = require('../utils/deliveryOrderPayload')

const userPopulate = 'name mobileNo phone email'

const getDeliveryBoyId = (req) => String(req.user?.id || req.user?._id || '')

const mapUserOrderSocketPayload = (order) => ({
  orderId: String(order._id),
  invoiceNumber: order.invoiceNumber,
  pnr: order.pnr,
  trainNumber: order.trainNumber,
  trainName: order.trainName,
  boardingStation: order.boardingStation,
  destinationStation: order.destinationStation,
  dateOfJourney: order.dateOfJourney,
  passengers: order.passengers,
  selectedStation: order.selectedStation,
  chef: order.chef,
  items: order.items,
  subtotal: order.subtotal,
  gstRate: order.gstRate,
  gstAmount: order.gstAmount,
  deliveryCharge: order.deliveryCharge,
  totalAmount: order.totalAmount,
  currency: order.currency,
  totalItems: order.totalItems,
  paymentStatus: order.paymentStatus,
  paymentMode: order.paymentMode,
  paymentMethod: order.paymentMethod,
  paymentProvider: order.paymentProvider,
  paymentReference: order.paymentReference,
  paymentUpiId: order.paymentUpiId,
  orderStatus: order.orderStatus,
  chefStatus: order.chefStatus,
  deliveryStatus: order.deliveryStatus,
  acceptedAt: order.acceptedAt,
  preparedAt: order.preparedAt,
  readyForPickupAt: order.readyForPickupAt,
  assignedAt: order.assignedAt,
  pickedUpAt: order.pickedUpAt,
  deliveredAt: order.deliveredAt,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
})

const emitDeliveryAndUserUpdate = (deliveryBoyId, order) => {
  const deliveryPayload = mapDeliveryOrderPayload(order)
  emitToDelivery(deliveryBoyId, 'delivery:order-updated', deliveryPayload)
  emitToUser(String(order.createdBy?._id || order.createdBy || ''), 'user:order-updated', mapUserOrderSocketPayload(order))
}

const findDeliveryOrder = async (deliveryBoyId, orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) return null

  const order = await userOrder
    .findById(orderId)
    .populate('createdBy', userPopulate)

  if (!order) return null

  const assignedToCurrent = String(order.assignedDeliveryId || '') === deliveryBoyId
  const isOpenForPickup = order.deliveryStatus === 'available_for_pickup'
  if (!isOpenForPickup && !assignedToCurrent) return null

  return order
}

const getAvailableDeliveryOrders = async (req, res) => {
  try {
    const deliveryBoyId = getDeliveryBoyId(req)
    if (!deliveryBoyId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const orders = await userOrder
      .find({
        paymentStatus: 'paid',
        chefStatus: 'ready_for_pickup',
        deliveryStatus: 'available_for_pickup',
      })
      .sort({ readyForPickupAt: -1, createdAt: -1 })
      .limit(25)
      .populate('createdBy', userPopulate)
      .lean()

    return res.status(200).json({
      success: true,
      data: orders.map(mapDeliveryOrderPayload),
    })
  } catch (err) {
    console.error('Error occurred while getAvailableDeliveryOrders:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to fetch delivery orders right now.' })
  }
}

const getDeliveryOrderById = async (req, res) => {
  try {
    const deliveryBoyId = getDeliveryBoyId(req)
    if (!deliveryBoyId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const order = await findDeliveryOrder(deliveryBoyId, req.params.orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    return res.status(200).json({ success: true, data: mapDeliveryOrderPayload(order) })
  } catch (err) {
    console.error('Error occurred while getDeliveryOrderById:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to fetch delivery order right now.' })
  }
}

const acceptDeliveryOrder = async (req, res) => {
  try {
    const deliveryBoyId = getDeliveryBoyId(req)
    if (!deliveryBoyId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const order = await findDeliveryOrder(deliveryBoyId, req.params.orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    if (order.deliveryStatus !== 'available_for_pickup' && String(order.assignedDeliveryId || '') !== deliveryBoyId) {
      return res.status(400).json({ success: false, message: 'This order is no longer available.' })
    }

    order.deliveryStatus = 'assigned'
    order.assignedDeliveryId = deliveryBoyId
    order.assignedAt = order.assignedAt || new Date()
    await order.save()
    await order.populate('createdBy', userPopulate)

    emitDeliveryAndUserUpdate(deliveryBoyId, order)
    return res.status(200).json({ success: true, data: mapDeliveryOrderPayload(order) })
  } catch (err) {
    console.error('Error occurred while acceptDeliveryOrder:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to accept delivery order right now.' })
  }
}

const markDeliveryOrderPickedUp = async (req, res) => {
  try {
    const deliveryBoyId = getDeliveryBoyId(req)
    if (!deliveryBoyId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const order = await findDeliveryOrder(deliveryBoyId, req.params.orderId)
    if (!order || String(order.assignedDeliveryId || '') !== deliveryBoyId) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    order.deliveryStatus = 'picked_up'
    order.orderStatus = 'out_for_delivery'
    order.pickedUpAt = order.pickedUpAt || new Date()
    await order.save()
    await order.populate('createdBy', userPopulate)

    emitDeliveryAndUserUpdate(deliveryBoyId, order)
    return res.status(200).json({ success: true, data: mapDeliveryOrderPayload(order) })
  } catch (err) {
    console.error('Error occurred while markDeliveryOrderPickedUp:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to mark order picked up right now.' })
  }
}

const markDeliveryOrderDelivered = async (req, res) => {
  try {
    const deliveryBoyId = getDeliveryBoyId(req)
    if (!deliveryBoyId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const order = await findDeliveryOrder(deliveryBoyId, req.params.orderId)
    if (!order || String(order.assignedDeliveryId || '') !== deliveryBoyId) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    order.deliveryStatus = 'delivered'
    order.orderStatus = 'completed'
    order.deliveredAt = order.deliveredAt || new Date()
    await order.save()
    await order.populate('createdBy', userPopulate)

    emitDeliveryAndUserUpdate(deliveryBoyId, order)
    return res.status(200).json({ success: true, data: mapDeliveryOrderPayload(order) })
  } catch (err) {
    console.error('Error occurred while markDeliveryOrderDelivered:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to mark order delivered right now.' })
  }
}

module.exports = {
  getAvailableDeliveryOrders,
  getDeliveryOrderById,
  acceptDeliveryOrder,
  markDeliveryOrderPickedUp,
  markDeliveryOrderDelivered,
}
