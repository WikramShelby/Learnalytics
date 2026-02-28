const express = require('express');
const router = express.Router();
const { studentPerformance } = require('../controllers/performanceController');

router.get('/student/:id', studentPerformance);

module.exports = router;