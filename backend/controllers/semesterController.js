const db = require('../config/db');

exports.createSemester = async (req, res) => {
  try {
    const { student_id, start_date, end_date } = req.body;

    if (!student_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({
        error: 'Start date must be before end date'
      });
    }

    const [studentRows] = await db.query(
      'SELECT id FROM students WHERE id = ?',
      [student_id]
    );

    if (studentRows.length === 0) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const [semesterRows] = await db.query(
      'SELECT id FROM semesters WHERE student_id = ?',
      [student_id]
    );

    if (semesterRows.length > 0) {
      return res.status(400).json({
        error: 'Semester already exists for this student'
      });
    }

    const [result] = await db.query(
      'INSERT INTO semesters (student_id, start_date, end_date) VALUES (?, ?, ?)',
      [student_id, start_date, end_date]
    );

    res.status(201).json({
      message: 'Semester created successfully',
      semesterId: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};