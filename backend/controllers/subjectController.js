const db = require('../config/db');

exports.createSubject = async (req, res) => {
  try {
    const {
      semester_id,
      name,
      credits,
      internal_weight,
      final_weight,
      target_score
    } = req.body;

    if (
      !semester_id ||
      !name ||
      !credits ||
      !internal_weight ||
      !final_weight ||
      target_score === undefined
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [semesterRows] = await db.query(
      'SELECT id FROM semesters WHERE id = ?',
      [semester_id]
    );

    if (semesterRows.length === 0) {
      return res.status(400).json({ error: 'Semester not found' });
    }

    const [countRows] = await db.query(
      'SELECT COUNT(*) AS count FROM subjects WHERE semester_id = ?',
      [semester_id]
    );

    if (countRows[0].count >= 5) {
      return res.status(400).json({
        error: 'Maximum 5 subjects allowed per semester'
      });
    }

    const [result] = await db.query(
      `INSERT INTO subjects
       (semester_id, name, credits, internal_weight, final_weight, target_score)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [semester_id, name, credits, internal_weight, final_weight, target_score]
    );

    res.status(201).json({
      message: 'Subject created successfully',
      subjectId: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};