const express = require('express');
const router = express.Router();
const { createAssessment } = require('../controllers/assessmentController');

router.post('/', createAssessment);

module.exports = router;