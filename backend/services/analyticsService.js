const db = require('../config/db')

exports.getSubjectsAnalytics = async (subjectId) => {

    const [assessments] = await db.query(
        'SELECT score_obtained, total_marks FROM assessments WHERE subject_id = ?',
        [subjectId]
    );

    if (assessments.length === 0) {
        return {
            totalAssessments: 0,
            averagePercentage: 0,
            highestPercentage: 0,
            lowestPercentage: 0,
            overallPercentage: 0
        };
    }

    let totalObtained = 0;
    let totalMarks = 0;

    const percentages = assessments.map(a => {
        const obtained = Number(a.score_obtained);
        const total = Number(a.total_marks);
        const percent = (obtained / total) * 100;

        totalObtained += obtained;
        totalMarks += total;
        return percent;
    });

    const average =
        percentages.reduce((a, b) => a + b, 0) / percentages.length;

    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);
    const overall = (totalObtained / totalMarks) * 100;

    return {
        totalAssessments: assessments.length,
        averagePercentage: Number(average.toFixed(2)),
        highestPercentage: Number(highest.toFixed(2)),
        lowestPercentage: Number(lowest.toFixed(2)),
        overallPercentage: Number(overall.toFixed(2))
    };
};

