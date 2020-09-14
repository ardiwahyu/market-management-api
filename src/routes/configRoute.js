const express = require('express');
const router = express.Router();
const { getUnit, addUnit, deleteUnit } = require('../controller/configController');

router.get('/config/unit', getUnit);
router.post('/config/unit', addUnit);
router.delete('/config/unit/delete/:id', deleteUnit);

module.exports = router;