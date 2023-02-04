const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');
const authController = require('../controllers/auth');

router.get('/orders', authController.isLoggedIn, customerController.orders);


module.exports = router;