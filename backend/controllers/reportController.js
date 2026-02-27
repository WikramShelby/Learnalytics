const db = require('../config/db');

exports.getStudentReport = async (req, res) => {
  try {
    const studentId = req.params.id;

    const [studentRows] = await db.query(
      'SELECT * FROM students WHERE id = ?',
      [studentId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = studentRows[0];

    const [semesterRows] = await db.query(
      'SELECT * FROM semesters WHERE student_id = ?',
      [studentId]
    );

    if (semesterRows.length === 0) {
      return res.status(404).json({
        error: 'Semester not found for this student'
      });
    }

    const semester = semesterRows[0];

    const [subjects] = await db.query(
      'SELECT * FROM subjects WHERE semester_id = ?',
      [semester.id]
    );

    for (let subject of subjects) {
      const [assessments] = await db.query(
        'SELECT * FROM assessments WHERE subject_id = ?',
        [subject.id]
      );
      subject.assessments = assessments;
    }

    res.json({
      student,
      semester,
      subjects
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};