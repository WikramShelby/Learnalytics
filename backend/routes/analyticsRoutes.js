const express = require('express');
const router = express.Router();
const { subjectAnalytics } = require('../controllers/analyticsController');
//const { getSubjectsAnalytics } = require('../services/analyticsService');

router.get('/subject/:id', subjectAnalytics);

module.exports = router;