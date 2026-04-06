const mongoose = require('mongoose');

const RegisterSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chefAuth",
        required: true,
        unique: true,
    },
    kitchenName: {
        type: String,
        required: true,
    },
    cuisine: {
        type: String,
        required: true,
    },
    speciality: {
        type: String,
        default: '',
    },
    experience: {
        type: String,
        required: true,
    },
    maxOrders: {
        type: String,
        required: true,
    },
    addressLine: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    nearestStation: {
        type: String,
        required: true,
    },
    prepTime: {
        type: String,
        required: true,
    },
    openTime: {
        type: String,
        required: true,
    },
    closeTime: {
        type: String,
        required: true,
    },
    availableDays: {
        type: [String],
        required: true,
        default: [],
    },
    idProof: {
        type: String,
        required: true,
    },
    chefPhoto: {
        type: String,
        required: true,
    },
    upiOrAccount: {
        type: String,
        required: true,
    },
    accountHolder: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    ifscCode: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false,
    },
    reviewStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    reviewedAt: {
        type: Date,
        default: null,
    },
    rejectionReason: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
})


module.exports = mongoose.model('chefRegister', RegisterSchema)
