const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const authController = require('../controllers/auth');

router.get("/", authController.isLoggedIn, (req, res) => {
    if( (req.user) && req.usertype == 'manager' ) {
        res.render("product", { user: req.user});
    } else {
        res.redirect('/login');
    }
});

router.get('/displaySelected/:productID', authController.isLoggedIn, productController.displaySelected);

router.post('/update/:productID', authController.isLoggedIn, productController.update);

router.get('/delete/:productID', authController.isLoggedIn, productController.delete);

router.get('/buy', authController.isLoggedIn, productController.buy);

router.get('/crud', authController.isLoggedIn, productController.displayforadmin);

router.get("/addproduct", authController.isLoggedIn, (req, res) => {
    if( (req.user) && req.usertype == 'manager' ) {
        res.render("product", { user: req.user, addproduct: true});
    } else {
        res.redirect('/login');
    }
});

router.get("/addproductexcel", authController.isLoggedIn, (req, res) => {
    if( (req.user) && req.usertype == 'manager' ) {
        res.render("product", { user: req.user, addproductexcel: true});
    } else {
        res.redirect('/login');
    }
});

module.exports = router;