const express = require('express');
const Book = require('../models/Book');
const multer = require('multer');
const Basket = require('../models/Basket');
const router = express.Router();
const {ensureAuthenticated} = require('../config/sec');
const { ensureAdmin } = require('../config/admincheck');
const Order = require('../models/Order');
const User = require('../models/User');
const e = require('express');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/media/images');
    },
    filename: function(req,file,cb){
        const now = new Date().toISOString();
        const date = now.replace(/:/g, '-');
        cb(null, date + file.originalname);
    }
})
const upload = multer({storage: storage});


router.get('/', (req, res) => {
    Book.find({}).exec(function(err,Books){
        if(err){
            console.log("error getting books");
        }else{
            res.render('homepagepub', {Books: Books});
            console.log(Books);
        }
    })
});

//Page for register
router.delete('/:bookId', (req, res) => {
    try{
        const removedBook = Book.remove({_id: req.params.bookId});
        res.json(books);
    }catch (err){
        res.json({message: err});
    }   
});

router.get('/books/dash',ensureAuthenticated,ensureAdmin, (req, res) => {
    Book.find({}).exec(function(err,Books){
        if(err){
            console.log("error getting books");
        }else{
            res.render('dashboard', {Books: Books, user: req.user});
            console.log(Books);
        }
    })
});

router.get('/books/private',ensureAuthenticated, (req, res) => {
    Book.find({}).exec(function(err,Books){
        if(err){
            console.log("error getting books");
        }else{
            res.render('homepage', {Books: Books,user: req.user,Sort: []});
        }
    })
});

router.post('/books/private/:categories',ensureAuthenticated, (req, res) => {
    Book.find({}).exec(function(err,Books){
        if(err){
            console.log("error getting books");
        }else{
            res.render('homepage', {Books: Books,user: req.user, Sort: req.params.categories});
            console.log(req.params.categories);
        }
    })
});

router.post('/books/sort',ensureAuthenticated, (req, res) => {
    
    Book.find({}).exec(function(err,Books){
        if(err){
            console.log("error getting books");
        }else{
            res.render('homepage', {Books: Books,user: req.user,Sort: req.params.category});
            console.log(req.params.category);
        }
    })
});





router.get('/orders/dash',ensureAuthenticated,ensureAdmin, (req, res) => {
    Order.find({}).exec(function(err,order){
        if(err){
            console.log(err);
        }else{
            res.render('orders', { user: req.user, Orders: order});
        }
        
    })
});

router.post('/books/private',ensureAuthenticated, (req,res) => {
    userId = req.user._id;
    Basket.findOne({userId: userId})
        .then(basket => {
            if(basket){
                console.log("basket found");
                basket.products.push(req.body.bookId);
                basket.save().then(Basket => {
                    res.redirect('/data/books/private');
                }).catch(err => console.log(err));;
            }else{
                const products = [req.body.bookId];
                const b = new Basket({
                    userId,
                    products
                });
                
                b.save().then(Basket => {
                    res.redirect('/data/books/private');
                }).catch(err => console.log(err));
            }
        })
});


router.put('/:bookId', (req, res) => {
    console.log(req.params);
    Book.findOne({_id: req.body.bookId})
    .then(book => {
        if(book){
            book.stock = req.body.stock;
            book.save().then(Book => {
                res.redirect('/data/books/dash');
            }).catch(err => console.log(err));        
        }else{
            console.log("Book not found")
        }
    })
    }
);




router.post('/books',ensureAuthenticated,ensureAdmin,upload.single('imagePath'), (req, res) => {
    const {title,description,category,price,author,publishyear} = req.body;
    let errors = [];
    imagePath = req.file.filename;
    console.log(req.body);
    if(!title || !description || !author || !category || !price || !publishyear){
        errors.push({msg: 'Please fill in all required fields'});
    }

    if(errors.length > 0){
        res.render('/data/books/dash', {
            title,description,category,price,author,publishyear
        })
        
    }else{
        Book.findOne({title: title})
        .then(book => {
            if(book){
                res.render('/data/books/dash', {
                    title,description,category,price,author,publishyear
                })
            }else{
                const b = new Book({
                    title,
                    description,
                    imagePath,
                    category,
                    price,
                    author,
                    publishyear
                });

                
                b.save().then(Book => {
                    res.redirect('/data/books/dash');
                }).catch(err => console.log(err));
            }
        })
    }
    console.log(errors);
});


router.get('/basket/private',ensureAuthenticated, (req, res) => {
    Basket.findOne({userId: req.user._id}).exec(function(err,basket){
        if(err){
            console.log("error getting books");
        }else if(basket == null){
            res.redirect('/data/books/private');
        }else{
                Book.find({_id: basket.products}).exec(function(err,prod){
                    if(err){
                        console.log(err);
                        res.render('/data/books/private');
                        }else{
                        //console.log(prod);
                        let prods = [];
                        basket.products.forEach(book => {
                            prods.push(book);
                        });
                        res.render('basket', {Basket: basket, Books: prod, Prods: prods, user: req.user});
                    }
                });
            
        }
    })
});

router.post('/basket/remove',ensureAuthenticated, (req, res) => {
    Basket.findOne({userId: req.user._id}).exec(function(err,basket){
        if(err){
            console.log("error getting basket");
            res.redirect('/data/books/private');
        }else{
            var products = basket.products;
            
            for(var i = 0;i <= products.length;i++){
                if(products[i] == req.body.bookId){
                    products.splice(i,1);
                    break;
                }
            }

            basket.products = products;
            
            basket.save().then(basket => {
                res.redirect('/data/books/private');
            }).catch(err => console.log(err));
            
        }
    })
});

router.post('/basket/private', ensureAuthenticated, (req, res) => {
    const {name,email,address1,postcode,houseno,address2} = req.body;
    console.log(name,email,address1,postcode,houseno,address2);
    //console.log(req);
    let prods = [];
    Basket.findOne({userId: req.user._id}).exec(function(err,basket){
        if(err){
            console.log("error getting books");
        }else{  
            var occurences = [{}];
            if(basket.products != null){
                basket.products.forEach(prod => {
                    occurences.forEach(occ => {
                        if(occ.Id != prod){
                            occurences.push({Id: prod,occurences: 1});
                        }else{
                            occ.occurences++;
                        }
                    });
                });

                console.log(occurences);
            var booksupdate = [];
            occurences.forEach(occurence => {
                if(occurence != {}){
                    Book.findOne({_id: occurence.Id}).exec(function(err,book){
                        if(err || book == null){
                            console.log("error finding book");
                        }else{
                            console.log(book);
                            book.stock -= occurence.occurences;
                            book.save().then(basket => {
                    
                            }).catch(err => console.log(err));
                        }
                    })
                }
                
            });
            }
            const products = basket.products;
            console.log(products);
            const order = new Order({
                products,
                email,
                address1,
                postcode,
                houseno,
                address2,
                name
            });
   
            order.save().then(order => {
                basket.products = [];
                console.log(basket.products);
                basket.save().then(basket => {
                    console.log("Wiped basket");
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));

            res.redirect('/data/books/private');
        }
    })
});

module.exports = router;
