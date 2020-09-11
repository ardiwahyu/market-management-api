const express = require('express');
const router = express.Router();
const { getBuyHistory, addBuyHistory, deleteBuyHistory } = require('../controller/buyContoller');

router.get('/pembelian', getBuyHistory);
router.post('/pembelian', addBuyHistory);
router.delete('/pembelian/delete/:id', deleteBuyHistory);

module.exports = router;