const express = require('express');
const router = express.Router();
const { getProduct, addProduct, updateProduct, searchProduct, deleteProduct } = require('../controller/productController');

router.get('/product', getProduct);
router.post('/product', addProduct);
router.put('/product/:id', updateProduct);
router.get('/product/search', searchProduct);
router.delete('/product/delete/:id', deleteProduct);

module.exports = router;