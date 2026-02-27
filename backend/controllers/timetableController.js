const db = require('../config/db');

exports.createTimetableEntry = async (req, res) => {
  try {
    const { semester_id, day_of_week, class_start, class_end } = req.body;

    if (!semester_id || !day_of_week || !class_start || !class_end) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (class_start >= class_end) {
      return res.status(400).json({
        error: 'Class start time must be before end time'
      });
    }

    const [semesterRows] = await db.query(
      'SELECT id FROM semesters WHERE id = ?',
      [semester_id]
    );

    if (semesterRows.length === 0) {
      return res.status(400).json({ error: 'Semester not found' });
    }

    const [overlapRows] = await db.query(
      `SELECT id FROM timetable
       WHERE semester_id = ?
       AND day_of_week = ?
       AND (
            class_start < ?
            AND class_end > ?
       )`,
      [semester_id, day_of_week, class_end, class_start]
    );

    if (overlapRows.length > 0) {
      return res.status(400).json({
        error: 'Class timing overlaps with existing entry'
      });
    }

    const [result] = await db.query(
      `INSERT INTO timetable
       (semester_id, day_of_week, class_start, class_end)
       VALUES (?, ?, ?, ?)`,
      [semester_id, day_of_week, class_start, class_end]
    );

    res.status(201).json({
      message: 'Timetable entry created successfully',
      timetableId: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};