const express = require('express');
const router = express.Router();
const { createTimetableEntry } = require('../controllers/timetableController');

router.post('/', createTimetableEntry);

module.exports = router;