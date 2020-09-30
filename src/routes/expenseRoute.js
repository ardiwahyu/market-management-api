const express = require('express');
const router = express.Router();
const { getExpenseHistory, addExpenseHistory, deleteExpenseHistory } = require('../controller/expenseController');

router.get('/pengeluaran', getExpenseHistory);
router.post('/pengeluaran', addExpenseHistory);
router.delete('/pengeluaran/delete/:id', deleteExpenseHistory);

module.exports = router;