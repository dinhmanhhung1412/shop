const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String
    },
    userpassword: {
        type: String
    },
    fullName: {
        type: String
    },
    address: {
        type: String
    }
})

const cartSchema = new Schema({
    product: {
        type: String
    },
    quantity: {
        type: String
    },
    totalMoney: { type: Number },
    user: {
        type: String
    },
    productID: { type: Schema.Types.ObjectId }
})

const orderSchema = new Schema({
    username: { type: String },
    fullName: { type: String },
    address: { type: String },
    total: { type: Number },
    status: { type: String },
    order: {
        type: { cartSchema }
    }
})

const statusSchema = new Schema({
    statusName: { type: String }
})

const adminSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    fullName: {
        type: String
    }
})

module.exports.orderstatus = mongoose.model('OrderStatus', statusSchema)
module.exports.user = mongoose.model('User', userSchema)
module.exports.admin = mongoose.model('Admin', adminSchema)
module.exports.cart = mongoose.model('Cart', cartSchema)
module.exports.order = mongoose.model('Order', orderSchema)