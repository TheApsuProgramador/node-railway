const express = require('express');
const PaypalController = require('../controllers/PaypalController.js');
const router = express.Router();

router.get('/', PaypalController.verify);

module.exports = router;
