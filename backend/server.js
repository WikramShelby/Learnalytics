const express = require('express');
const app = express();

app.use(express.json());

const studentRoutes = require('./routes/studentRoutes');
const semesterRoutes = require('./routes/semesterRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/students', studentRoutes);
app.use('/semesters', semesterRoutes);
app.use('/subjects', subjectRoutes);
app.use('/assessments', assessmentRoutes);
app.use('/timetable', timetableRoutes);
app.use('/report', reportRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});