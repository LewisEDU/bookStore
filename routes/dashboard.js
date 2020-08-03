const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Page for register
router.get('/stock', (req, res) => res.render('register'));

module.exports = router;