const express = require('express');
const router = express.Router();
const { createSemester } = require('../controllers/semesterController');

router.post('/', createSemester);

module.exports = router;