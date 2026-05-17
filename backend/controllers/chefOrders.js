const mongoose = require('mongoose')
const deliveryRegister = require('../models/deliveryRegister')
const userOrder = require('../models/userOrder')
const { emitToChef, emitToDelivery, emitToUser } = require('../socket')
const { calculateDeliveryEarning, mapDeliveryOrderPayload } = require('../utils/deliveryOrderPayload')

const ACTIVE_CHEF_STATUSES = ['new', 'accepted', 'preparing', 'prepared']
const PAST_CHEF_STATUSES = ['ready_for_pickup', 'completed', 'cancelled']

const getChefId = (req) => String(req.user?.id || req.user?._id || '')

const mapChefOrder = (order) => ({
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
  orderStatus: order.orderStatus,
  chefStatus: order.chefStatus,
  deliveryStatus: order.deliveryStatus,
  acceptedAt: order.acceptedAt,
  preparedAt: order.preparedAt,
  readyForPickupAt: order.readyForPickupAt,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
})

const findChefOrder = async (chefId, orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) return null

  return userOrder.findOne({
    _id: orderId,
    'chef.authId': chefId,
  })
}

const emitChefOrderUpdate = (chefId, order, eventName = 'chef:order-updated') => {
  const payload = mapChefOrder(order)
  emitToChef(chefId, eventName, payload)
  emitToUser(String(order.createdBy?._id || order.createdBy || ''), 'user:order-updated', payload)
}

const broadcastReadyOrderToDelivery = async (order) => {
  if (typeof order.populate === 'function') {
    await order.populate('createdBy', 'name mobileNo phone email')
  }

  const approvedDeliveries = await deliveryRegister
    .find({ status: 'approved' })
    .select('createdBy')
    .lean()
  const payload = mapDeliveryOrderPayload(order)

  approvedDeliveries.forEach((delivery) => {
    emitToDelivery(String(delivery.createdBy), 'delivery:new-order', payload)
    emitToDelivery(String(delivery.createdBy), 'delivery:order-assigned', payload)
  })
}

const getChefOrders = async (req, res) => {
  try {
    const chefId = getChefId(req)
    if (!chefId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const view = String(req.query?.view || 'active').toLowerCase()
    const statuses = view === 'past' ? PAST_CHEF_STATUSES : ACTIVE_CHEF_STATUSES
    const orders = await userOrder
      .find({
        'chef.authId': chefId,
        paymentStatus: 'paid',
        chefStatus: { $in: statuses },
      })
      .sort({ createdAt: -1 })
      .limit(view === 'past' ? 50 : 25)
      .lean()

    return res.status(200).json({
      success: true,
      data: orders.map(mapChefOrder),
    })
  } catch (err) {
    console.error('Error occurred while getChefOrders:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to fetch chef orders right now.' })
  }
}

const getChefOrderById = async (req, res) => {
  try {
    const chefId = getChefId(req)
    const order = await findChefOrder(chefId, req.params.orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    return res.status(200).json({ success: true, data: mapChefOrder(order) })
  } catch (err) {
    console.error('Error occurred while getChefOrderById:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to fetch order details right now.' })
  }
}

const acceptChefOrder = async (req, res) => {
  try {
    const chefId = getChefId(req)
    const order = await findChefOrder(chefId, req.params.orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    if (!['new', 'accepted', 'preparing', 'prepared'].includes(order.chefStatus)) {
      return res.status(400).json({ success: false, message: 'This order can no longer be accepted.' })
    }

    order.chefStatus = 'accepted'
    order.orderStatus = 'accepted'
    order.acceptedAt = order.acceptedAt || new Date()
    await order.save()

    emitChefOrderUpdate(chefId, order)
    return res.status(200).json({ success: true, data: mapChefOrder(order) })
  } catch (err) {
    console.error('Error occurred while acceptChefOrder:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to accept order right now.' })
  }
}

const markChefOrderItemDone = async (req, res) => {
  try {
    const chefId = getChefId(req)
    const order = await findChefOrder(chefId, req.params.orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    if (!['accepted', 'preparing', 'prepared'].includes(order.chefStatus)) {
      return res.status(400).json({ success: false, message: 'Accept this order before marking items done.' })
    }

    const itemIndex = Number(req.params.itemIndex)
    if (!Number.isInteger(itemIndex) || itemIndex < 0 || itemIndex >= order.items.length) {
      return res.status(400).json({ success: false, message: 'Invalid order item.' })
    }

    order.items[itemIndex].isPrepared = true
    order.items[itemIndex].preparedAt = new Date()
    order.chefStatus = 'preparing'
    order.orderStatus = 'preparing'

    const allPrepared = order.items.every((item) => item.isPrepared)
    if (allPrepared) {
      order.chefStatus = 'prepared'
      order.orderStatus = 'prepared'
      order.preparedAt = order.preparedAt || new Date()
    }

    await order.save()

    emitChefOrderUpdate(chefId, order)
    return res.status(200).json({ success: true, data: mapChefOrder(order) })
  } catch (err) {
    console.error('Error occurred while markChefOrderItemDone:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to update item status right now.' })
  }
}

const markChefOrderReadyForPickup = async (req, res) => {
  try {
    const chefId = getChefId(req)
    const order = await findChefOrder(chefId, req.params.orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    const allPrepared = order.items.every((item) => item.isPrepared)
    if (!allPrepared) {
      return res.status(400).json({ success: false, message: 'Mark all items done before ready for pickup.' })
    }

    order.chefStatus = 'ready_for_pickup'
    order.orderStatus = 'ready_for_pickup'
    order.preparedAt = order.preparedAt || new Date()
    order.readyForPickupAt = order.readyForPickupAt || new Date()
    order.deliveryStatus = 'available_for_pickup'

    const earning = calculateDeliveryEarning(order)
    order.deliveryChargeShare = earning.deliveryChargeShare
    order.deliveryGstShareRate = earning.deliveryGstShareRate
    order.deliveryGstShareAmount = earning.deliveryGstShareAmount
    order.deliveryEarningAmount = earning.deliveryEarningAmount
    await order.save()

    emitChefOrderUpdate(chefId, order)
    emitChefOrderUpdate(chefId, order, 'chef:order-ready-for-pickup')
    await broadcastReadyOrderToDelivery(order)
    return res.status(200).json({ success: true, data: mapChefOrder(order) })
  } catch (err) {
    console.error('Error occurred while markChefOrderReadyForPickup:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to mark order ready right now.' })
  }
}

module.exports = {
  getChefOrders,
  getChefOrderById,
  acceptChefOrder,
  markChefOrderItemDone,
  markChefOrderReadyForPickup,
}
