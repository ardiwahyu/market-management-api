const express = require('express');
const router = express.Router();
const { getRekapDayMonth } = require('../controller/rekapController');

router.get('/rekap', getRekapDayMonth);

module.exports = router;