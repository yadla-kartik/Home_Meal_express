const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    adminCode: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

// Compare password directly (user requested no decryption/encryption)
AdminSchema.methods.comparePassword = async function (enteredPassword) {
    return this.password === enteredPassword;
}

module.exports = mongoose.model('adminAuth', AdminSchema)
