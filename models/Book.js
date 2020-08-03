const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    category:[{
        type: String,
        ref:'category'
    }],
    price: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishyear: {
        type: Date,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    }
});

const Books = mongoose.model('Book', BookSchema); 

module.exports = Books;