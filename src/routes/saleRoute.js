const express = require('express');
const router = express.Router();
const { getSaleHistory, addSaleHistory, deleteSaleHistory } = require('../controller/saleController');

router.get('/penjualan', getSaleHistory);
router.post('/penjualan', addSaleHistory);
router.delete('/penjualan/delete/:id', deleteSaleHistory);

module.exports = router;