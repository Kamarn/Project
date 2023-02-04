const express = require('express');
const router = express.Router();
const managerController = require('../controllers/manager');
const authController = require('../controllers/auth');

router.get('/display', authController.isLoggedIn, managerController.display);
router.get('/orders', authController.isLoggedIn, managerController.orders);
router.get('/update/:email', authController.isLoggedIn, managerController.update);
router.get('/delete/:email', authController.isLoggedIn, managerController.delete);
router.post('/addnewproduct', authController.isLoggedIn, managerController.addnewproduct);
router.post('/addnewproductexcel', authController.isLoggedIn, managerController.addnewproductexcel);

router.get("/addproduct", authController.isLoggedIn, (req, res) => {
    res.render("product", { user: req.user});
});

module.exports = router;