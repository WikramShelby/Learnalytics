const db = require('../config/db');

// GET /students
exports.getStudents = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

// POST /students
exports.createStudent = async (req, res) => {
  try {
    const { name, email, target_cgpa } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required'
      });
    }

    const [result] = await db.query(
      'INSERT INTO students (name, email, target_cgpa) VALUES (?, ?, ?)',
      [name, email, target_cgpa]
    );

    res.status(201).json({
      message: 'Student created successfully',
      studentId: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};