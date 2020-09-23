const express = require('express');
const router = express.Router();
const { getProduct, addProduct, updateProduct, searchProduct, deleteProduct, getAllProduct } = require('../controller/productController');

router.get('/product', getProduct);
router.get('/product/all', getAllProduct);
router.post('/product', addProduct);
router.put('/product/:id', updateProduct);
router.get('/product/search', searchProduct);
router.delete('/product/delete/:id', deleteProduct);

module.exports = router;