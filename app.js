const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const app = express();

require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//EJS
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));


//Bodyparser
app.use(express.urlencoded({ extended: true}));

app.use(session({
    secret: 'secretthing',
    resave: true,
    saveUninitialized: true
  }))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/data'));
app.use('/users', require('./routes/users'));
app.use('/data', require('./routes/data'));
app.use('/basket', require('./routes/basket'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));