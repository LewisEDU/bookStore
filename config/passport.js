const local = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


module.exports = function(passport){
    passport.use(
        new local({usernameField: 'email'}, (email, password, done) =>{
            User.findOne({email: email}).then(
                user => {
                    if(!user){
                        return done(null, false, {message: 'No account with specificed email'})
                    }

                    bcrypt.compare(password, user.password, (err, matched) => {
                        if(err) throw err;

                        if(matched){
                            return done(null, user);
                        }else{
                            return done(null, false, {message: 'Incorrect password'});
                        }
                    });
                }
            ).catch(err => console.log(err))
        })
    );

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err,user);
        });
    });
}
