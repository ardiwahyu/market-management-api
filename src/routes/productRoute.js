const express = require('express');
const router = express.Router();
const { getProduct, addProduct } = require('../controller/productController');

router.get('/product', getProduct);

module.exports = router;