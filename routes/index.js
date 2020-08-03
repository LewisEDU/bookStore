const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/sec');
const User = require('../models/User');
const Book = require('../models/Book');
const { deserializeUser } = require('passport');
const { ensureAdmin } = require('../config/admincheck');
const { getBookData } = require('../localdata');
const Books = require('../models/Book');
router.get('/', (req, res) => res.render('welcome'));
const data = require('../routes/data');



router.get('/homepage',ensureAuthenticated, (req, res) => res.render('homepage', {user: req.user}));
//router.get('/dashboard',ensureAuthenticated,ensureAdmin, (req, res) => res.render('dashboard', {Books: Book.find({})}));
console.log(Book.find());
module.exports = router;