const mongoose = require('mongoose')

const userOrderDraftSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    pnr: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    pnrData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    trainSummary: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    availableStations: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    selectedStation: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    chefId: {
      type: String,
      default: '',
      trim: true,
    },
    chef: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    menuItems: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    cartItems: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    billing: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    payment: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    currentStep: {
      type: String,
      enum: ['pnr', 'station', 'chef', 'menu', 'cart', 'billing', 'payment', 'completed'],
      default: 'pnr',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
      index: true,
    },
    completedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userOrder',
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

userOrderDraftSchema.index({ createdBy: 1, pnr: 1, status: 1 })

module.exports = mongoose.model('userOrderDraft', userOrderDraftSchema)
