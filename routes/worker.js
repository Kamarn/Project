const express = require('express');
const router = express.Router();
const workerController = require('../controllers/worker');
const authController = require('../controllers/auth');

router.get('/display', authController.isLoggedIn, workerController.display);
router.get('/displaySelected/:email', authController.isLoggedIn, workerController.displaySelected);
router.post('/update/:email', authController.isLoggedIn, workerController.update);

module.exports = router;