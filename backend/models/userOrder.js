const mongoose = require('mongoose')

const orderPassengerSchema = new mongoose.Schema(
  {
    bookingStatus: { type: String, default: '', trim: true },
    currentStatus: { type: String, default: '', trim: true },
    coach: { type: String, default: '', trim: true },
    berth: { type: String, default: '', trim: true },
    berthType: { type: String, default: '', trim: true },
  },
  { _id: false },
)

const orderStationSchema = new mongoose.Schema(
  {
    code: { type: String, default: '', trim: true },
    name: { type: String, default: '', trim: true },
    sequence: { type: Number, default: 0 },
    day: { type: String, default: '', trim: true },
    distance: { type: String, default: '', trim: true },
    scheduledArrival: { type: String, default: '', trim: true },
    scheduledDeparture: { type: String, default: '', trim: true },
    liveArrival: { type: String, default: '', trim: true },
    liveDeparture: { type: String, default: '', trim: true },
    haltTime: { type: String, default: '', trim: true },
  },
  { _id: false },
)

const orderChefSnapshotSchema = new mongoose.Schema(
  {
    authId: { type: mongoose.Schema.Types.ObjectId, ref: 'chefAuth', required: true },
    registerId: { type: mongoose.Schema.Types.ObjectId, ref: 'chefRegister', required: true },
    name: { type: String, default: '', trim: true },
    kitchenName: { type: String, default: '', trim: true },
    cuisine: { type: String, default: '', trim: true },
    speciality: { type: String, default: '', trim: true },
    nearestStation: { type: String, default: '', trim: true },
    prepTime: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
  },
  { _id: false },
)

const orderItemSchema = new mongoose.Schema(
  {
    dishId: { type: String, required: true, trim: true },
    name: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    category: { type: String, default: '', trim: true },
    price: { type: Number, default: 0, min: 0 },
    quantity: { type: Number, default: 1, min: 1 },
    lineTotal: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: '', trim: true },
    servingSize: { type: String, default: '', trim: true },
    spiceLevel: { type: String, default: '', trim: true },
  },
  { _id: false },
)

const userOrderSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    pnr: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    trainNumber: {
      type: String,
      default: '',
      trim: true,
    },
    trainName: {
      type: String,
      default: '',
      trim: true,
    },
    boardingStation: {
      type: String,
      default: '',
      trim: true,
    },
    destinationStation: {
      type: String,
      default: '',
      trim: true,
    },
    dateOfJourney: {
      type: String,
      default: '',
      trim: true,
    },
    passengers: {
      type: [orderPassengerSchema],
      default: [],
    },
    selectedStation: {
      type: orderStationSchema,
      required: true,
    },
    chef: {
      type: orderChefSnapshotSchema,
      required: true,
    },
    items: {
      type: [orderItemSchema],
      default: [],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'At least one item is required.',
      },
    },
    totalItems: {
      type: Number,
      default: 0,
      min: 1,
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    gstRate: {
      type: Number,
      default: 0.05,
      min: 0,
    },
    gstAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 30,
      min: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    invoiceNumber: {
      type: String,
      default: '',
      trim: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending_payment', 'placed', 'cancelled'],
      default: 'pending_payment',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: '',
      trim: true,
    },
    paymentMode: {
      type: String,
      default: '',
      trim: true,
    },
    paymentProvider: {
      type: String,
      default: '',
      trim: true,
    },
    paymentReference: {
      type: String,
      default: '',
      trim: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      default: 'pnr',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('userOrder', userOrderSchema)
