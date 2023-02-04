const express = require('express');
const authController = require('../controllers/auth');
const productController = require('../controllers/product');
const router = express.Router();

/* router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+'/views/ind.html'))
}); */
  
router.get('/', authController.isLoggedIn, productController.display);
router.get('/productinfo/:productName', authController.isLoggedIn, productController.productinfo);


router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/meet", authController.isLoggedIn, (req, res) => {
    if( (req.user) && (req.usertype == 'manager' || req.usertype == 'worker') ) {
        res.render('meet', {
        user: req.user
        });
    } else {
        res.redirect('/login');
    }
});

router.get("/customerProfile", authController.isLoggedIn, (req, res) => {
    if( (req.user) && req.usertype == 'customer' ) {
        res.render('customerProfile', {
        user: req.user
        });
    } else {
        res.redirect('/login');
    }
});

router.get("/workerProfile", authController.isLoggedIn, (req, res) => {
    if( (req.user) && req.usertype == 'worker' ) {
        res.render('workerProfile', {
        user: req.user
        });
    } else {
        res.redirect('/login');
    }
});

router.get("/managerProfile", authController.isLoggedIn, (req, res) => {
    if( (req.user) && req.usertype == 'manager' ) {
        res.render('managerProfile', {
        user: req.user
        });
    } else {
        res.redirect('/login');
    }
});

router.get("/Hesap", authController.isLoggedIn, (req, res) => {
    if( req.usertype == "manager" ) {
        res.render('managerProfile', {
        user: req.user
        });
    } else if( req.usertype == "worker" ){
        res.render('workerProfile', {
            user: req.user
        });
    }
    else if( req.usertype == "customer" ){
        res.render('customerProfile', {
            user: req.user
        });
    }
    else{
        res.redirect('/login');
    }
});


module.exports = router;