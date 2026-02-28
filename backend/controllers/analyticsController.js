const { getSubjectsAnalytics } = require('../services/analyticsService');

exports.subjectAnalytics = async (req, res) => {
  try {
    const subjectId = req.params.id;

    const analytics = await getSubjectsAnalytics(subjectId);

    res.json(analytics);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analytics error' });
  }
};