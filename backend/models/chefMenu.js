const mongoose = require('mongoose')

const chefMenuDishSchema = new mongoose.Schema(
  {
    dishId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      default: 'Veg',
      trim: true,
    },
    prepTime: {
      type: Number,
      default: 20,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    servingSize: {
      type: String,
      default: '1 person',
      trim: true,
    },
    spiceLevel: {
      type: String,
      default: 'Medium',
      trim: true,
    },
    addOns: {
      type: String,
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    stations: {
      type: [String],
      default: [],
    },
    imageMode: {
      type: String,
      enum: ['', 'upload', 'ai'],
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    priceGuidance: {
      status: {
        type: String,
        enum: ['', 'ok', 'high', 'low', 'unknown'],
        default: '',
      },
      suggestedMin: {
        type: Number,
        default: 0,
        min: 0,
      },
      suggestedMax: {
        type: Number,
        default: 0,
        min: 0,
      },
      warningMessage: {
        type: String,
        default: '',
        trim: true,
      },
      confidence: {
        type: String,
        default: '',
        trim: true,
      },
      checkedAt: {
        type: Date,
        default: null,
      },
      checkedSignature: {
        type: String,
        default: '',
        trim: true,
      },
      source: {
        type: String,
        default: '',
        trim: true,
      },
    },
  },
  { _id: false },
)

const chefMenuSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chefAuth',
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    dishes: {
      type: [chefMenuDishSchema],
      default: [],
    },
    lastSavedAt: {
      type: Date,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('chefMenu', chefMenuSchema)
