const DELIVERY_GST_SHARE_RATE = 0.025

const roundCurrency = (value) =>
  Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100

const calculateDeliveryEarning = (order = {}) => {
  const deliveryChargeShare = roundCurrency(order.deliveryCharge || 0)
  const deliveryGstShareAmount = roundCurrency(Number(order.subtotal || 0) * DELIVERY_GST_SHARE_RATE)
  const deliveryEarningAmount = roundCurrency(deliveryChargeShare + deliveryGstShareAmount)

  return {
    deliveryChargeShare,
    deliveryGstShareRate: DELIVERY_GST_SHARE_RATE,
    deliveryGstShareAmount,
    deliveryEarningAmount,
  }
}

const getPassengerDropLabel = (order = {}) => {
  const passenger = Array.isArray(order.passengers) ? order.passengers[0] : null
  const coachSeat = [passenger?.coach, passenger?.berth].filter(Boolean).join(' ')
  return coachSeat ? `${coachSeat}${passenger?.berthType ? ` (${passenger.berthType})` : ''}` : 'Passenger coach details'
}

const getPassengerContact = (order = {}) => {
  const user = order.createdBy && typeof order.createdBy === 'object' ? order.createdBy : {}
  const passenger = Array.isArray(order.passengers) ? order.passengers[0] : null
  const passengerSeat = getPassengerDropLabel(order)

  return {
    name: user.name || passenger?.name || 'Passenger',
    phone: user.mobileNo || user.phone || '',
    email: user.email || '',
    seat: passengerSeat,
    contactLabel: user.mobileNo || user.phone || user.email || 'Contact not available',
  }
}

const mapDeliveryOrderPayload = (order = {}) => {
  const earning = calculateDeliveryEarning(order)
  const itemCount = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    : 0
  const passenger = getPassengerContact(order)

  return {
    id: String(order._id || order.orderId || ''),
    orderId: String(order._id || order.orderId || ''),
    invoiceNumber: order.invoiceNumber || '',
    restaurant: order.chef?.kitchenName || order.chef?.name || 'Home kitchen',
    customer: passenger.name,
    customerSeat: passenger.seat,
    customerContact: passenger.contactLabel,
    customerPhone: passenger.phone,
    customerEmail: passenger.email,
    pickup: order.selectedStation?.name || order.selectedStation?.code || 'Selected station',
    kitchenAddress: order.chef?.nearestStation || order.selectedStation?.name || 'Kitchen pickup point',
    trainName: order.trainName || 'Train journey',
    trainNumber: order.trainNumber || '',
    drop: passenger.seat,
    amount: `Rs. ${earning.deliveryEarningAmount}`,
    earningPrice: `Rs. ${earning.deliveryEarningAmount}`,
    earning,
    billTotal: order.totalAmount || 0,
    deliveryCharge: order.deliveryCharge || 0,
    foodGstAmount: order.gstAmount || 0,
    distance: order.selectedStation?.distance || '0 km',
    kitchenDistance: order.selectedStation?.distance || '0 km',
    eta: order.selectedStation?.scheduledArrival || order.selectedStation?.liveArrival || 'Soon',
    deliveryTime: order.selectedStation?.scheduledArrival || order.selectedStation?.liveArrival || 'Soon',
    items: `${itemCount || order.totalItems || 0} meal${(itemCount || order.totalItems || 0) === 1 ? '' : 's'}`,
    itemList: order.items || [],
    priority: 'Ready pickup',
    selectedStation: order.selectedStation,
    chef: order.chef,
    pnr: order.pnr,
    deliveryStatus: order.deliveryStatus,
    chefStatus: order.chefStatus,
    orderStatus: order.orderStatus,
    readyForPickupAt: order.readyForPickupAt,
    assignedAt: order.assignedAt,
    pickedUpAt: order.pickedUpAt,
    deliveredAt: order.deliveredAt,
  }
}

module.exports = {
  DELIVERY_GST_SHARE_RATE,
  calculateDeliveryEarning,
  mapDeliveryOrderPayload,
}
