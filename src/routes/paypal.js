const express = require('express');
const PaypalController = require('../controllers/PaypalController.js');
const router = express.Router();
const auth = require('../auth/auth')

router.post('/', PaypalController.verify);
router.post('/store-payment', auth, PaypalController.firstPayment);

module.exports = router;
