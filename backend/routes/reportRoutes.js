const express = require('express');
const router = express.Router();
const { getStudentReport } = require('../controllers/reportController');

router.get('/:id', getStudentReport);

module.exports = router;