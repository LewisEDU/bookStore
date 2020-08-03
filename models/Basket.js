const mongoose = require('mongoose');

const BasketSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }],
});

const basket = mongoose.model('basket', BasketSchema);

module.exports = basket;