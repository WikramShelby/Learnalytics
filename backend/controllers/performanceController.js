const { getStudentPerformance } = require('../services/performanceService');

exports.studentPerformance = async (req, res) => {
  try {
    const studentId = req.params.id;

    const data = await getStudentPerformance(studentId);

    if (!data) {
      return res.status(404).json({
        error: 'Student or semester not found'
      });
    }

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Performance error' });
  }
};