const db = require('../config/db');

exports.getStudentPerformance = async (studentId) => {

  // Get semester
  const [semesterRows] = await db.query(
    'SELECT id FROM semesters WHERE student_id = ?',
    [studentId]
  );

  if (semesterRows.length === 0) {
    return null;
  }

  const semesterId = semesterRows[0].id;

  // Get subjects
  const [subjects] = await db.query(
    'SELECT id, name FROM subjects WHERE semester_id = ?',
    [semesterId]
  );

  let subjectSummaries = [];
  let overallObtained = 0;
  let overallTotal = 0;

  for (let subject of subjects) {

    const [assessments] = await db.query(
      'SELECT score_obtained, total_marks FROM assessments WHERE subject_id = ?',
      [subject.id]
    );

    if (assessments.length === 0) {
      subjectSummaries.push({
        subject: subject.name,
        percentage: 0
      });
      continue;
    }

    let totalObtained = 0;
    let totalMarks = 0;

    assessments.forEach(a => {
      totalObtained += Number(a.score_obtained);
      totalMarks += Number(a.total_marks);
    });

    const percentage = (totalObtained / totalMarks) * 100;

    overallObtained += totalObtained;
    overallTotal += totalMarks;

    subjectSummaries.push({
      subject: subject.name,
      percentage: Number(percentage.toFixed(2))
    });
  }

  const overallPercentage =
    overallTotal === 0 ? 0 :
    Number(((overallObtained / overallTotal) * 100).toFixed(2));

  const bestSubject =
    subjectSummaries.sort((a,b) => b.percentage - a.percentage)[0];

  const weakestSubject =
    subjectSummaries.sort((a,b) => a.percentage - b.percentage)[0];

  return {
    totalSubjects: subjects.length,
    overallPercentage,
    bestSubject,
    weakestSubject,
    subjectSummaries
  };
};