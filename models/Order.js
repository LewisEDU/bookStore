const mongoose = require('mongoose');
const basket = require('./Basket');

const OrderSchema = new mongoose.Schema({
    postcode: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: false
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }],
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    houseno: {
        type: String,
        required: true
    }
});

const Order = mongoose.model('Order', OrderSchema); 

module.exports = Order;