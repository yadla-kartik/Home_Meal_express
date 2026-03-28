const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const ChefSchema = mongoose.Schema({
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
    password: {
        type: String,
        required: true,
    },
    isRegistered: {
        default: false,
        type: Boolean,
    }
})


ChefSchema.pre('save', async function () {
    if (!this.isModified('password')) return

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//  Compare password without decryption 
ChefSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('chefAuth', ChefSchema)
