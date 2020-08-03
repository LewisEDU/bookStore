const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Page for login
router.get('/login', (req, res) => res.render('login'));

//Page for register
router.get('/register', (req, res) => res.render('register'));

//Register handle

router.post('/register', (req, res) => {
    const {name,email,password,password2} = req.body;
    let errors = [];


    if(password != password2){
        errors.push({msg: 'Passwords do not match'});
    }

    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all required fields'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,name,email,password,password2
        })
        
    }else{
        //Server side validation passed
        User.findOne({email: email})
        .then(user => {
            if(user){
                errors.push({msg: 'Account with specified email exists'});
                res.render('register', {
                    errors,name,email,password,password2
                })
            }else{
                const u = new User({
                    name,
                    email,
                    password
                });

                //Salting using bcrypt
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(u.password, salt, (err, hash) => {
                        if(err){throw err;}
                        u.password = hash;
                        u.save().then(user => {
                            res.redirect('/users/login');
                        }
                    ).catch(err => console.log(err));
                    })
                )
            }
        })            
    }

    console.log(errors);
});

router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/data/books/private',
        failureRedirect: '/users/login'
    })(req,res,next);
});

router.get('/logout', (req, res) =>{
    req.logout();
    res.redirect('/users/login')
});

module.exports = router;