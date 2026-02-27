const db = require('../config/db');

exports.createAssessment = async (req, res) => {
  try {
    const {
      subject_id,
      type,
      score_obtained,
      total_marks,
      assessment_date
    } = req.body;

    if (
      !subject_id ||
      !type ||
      score_obtained === undefined ||
      total_marks === undefined ||
      !assessment_date
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (total_marks <= 0) {
      return res.status(400).json({
        error: 'Total marks must be greater than 0'
      });
    }

    if (score_obtained < 0) {
      return res.status(400).json({
        error: 'Score cannot be negative'
      });
    }

    if (score_obtained > total_marks) {
      return res.status(400).json({
        error: 'Score cannot exceed total marks'
      });
    }

    const validTypes = ['Quiz', 'Internal', 'Mock', 'Final'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Invalid assessment type'
      });
    }

    const [subjectRows] = await db.query(
      'SELECT id FROM subjects WHERE id = ?',
      [subject_id]
    );

    if (subjectRows.length === 0) {
      return res.status(400).json({ error: 'Subject not found' });
    }

    const [result] = await db.query(
      `INSERT INTO assessments
       (subject_id, type, score_obtained, total_marks, assessment_date)
       VALUES (?, ?, ?, ?, ?)`,
      [subject_id, type, score_obtained, total_marks, assessment_date]
    );

    res.status(201).json({
      message: 'Assessment created successfully',
      assessmentId: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};