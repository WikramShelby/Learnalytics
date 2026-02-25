const express = require('express');
const db = require('./config/db');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Learnlytics Backend Running');
});

app.get('/students', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM students')
        res.json(rows);
    } catch (err) {
        console.log(error);
        res.status(500).json({ error: 'database error' });
    }
});

app.post('/students', async (req, res) => {
    try {
        const { name, email, target_cgpa } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'name and email are required' });
        }
        const [result] = await db.query(
            'INSERT INTO students (name,email,target_cgpa) VALUES (?,?,?)',
            [name, email, target_cgpa]
        );

        res.status(201).json({
            message: 'Student created successfully',
            studentId: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'database error' });
    }
});


app.post('/semesters', async(req,res)=>{
    console.log("Incoming semester request:", req.body);
    console.log("BODY RECEIVED:", req.body);
    try {
        const { student_id, start_date, end_date} = req.body;

        if(!student_id || !start_date || !end_date) {
            return res.status(400).json({error: 'All fields are required'});
        }

        if(new Date(start_date) >= new Date(end_date)) {
            return res.status(400).json({error:'start date must be before end date'});
        }

        const [studentRows] = await db.query(
            'SELECT id FROM students WHERE id = ?',
            [student_id]
        );

        if(studentRows.length === 0) {
            return res.status(400).json({error:'student not found'});
        }

        const [semesterRows] = await db.query(
            'SELECT id FROM semesters WHERE id = ?',
            [student_id]
        );

        if (semesterRows.length>0){
            return res.status(400).json({error: 'semester already exists for this student'})
        }
        //console.log("Semester rows result:", semesterRows);
        //console.log("Length:", semesterRows.length);
        
        const [result] = await db.query(
            'INSERT INTO semesters (student_id, start_date, end_date) VALUES (?,?,?)',
            [student_id, start_date, end_date]
        );
        res.status(201).json({
            message:'semester created successfully',
            semesterId: result.insertId
        });
    } catch(err){
        console.log(error);
        return res.status(500).json({error:'database error' });
    }
});

app.post('/subjects', async (req, res) => {
  try {
    const {
      semester_id,
      name,
      credits,
      internal_weight,
      final_weight,
      target_score
    } = req.body;

    // 1️⃣ Basic validation
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

    // 2️⃣ Check semester exists
    const [semesterRows] = await db.query(
      'SELECT id FROM semesters WHERE id = ?',
      [semester_id]
    );

    if (semesterRows.length === 0) {
      return res.status(400).json({ error: 'Semester not found' });
    }

    // 3️⃣ Check subject count (max 5 rule)
    const [countRows] = await db.query(
      'SELECT COUNT(*) AS count FROM subjects WHERE semester_id = ?',
      [semester_id]
    );

    if (countRows[0].count >= 5) {
      return res.status(400).json({
        error: 'Maximum 5 subjects allowed per semester'
      });
    }

    // 4️⃣ Insert subject
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
});

app.post('/assesments', async(req,res)=>{
    try {
        const {subject_id, type, score_obtained, total_marks, assessment_date} = req.body;

        if(!subject_id || !type || score_obtained === undefined || total_marks === undefined || !assessment_date) {
            return res.status(400).json({ error: 'All fields are required'});
        }

        if(total_marks <= 0){
            return res.status(400).json({error: 'total marks must be greater than zero'})
        }

        if(score_obtained < 0){
            return res.status(400).json({error:'score cannot be negative'});
        }
        if (score_obtained > total_marks) {
            return res.status(400).json({ error: 'Score cannot exceed total marks' });
        }

        const validTypes = ['Quiz','Internal','Mock','Final'];
        if(!validTypes.includes(type)) {
            return res.status(400).json({error:'Invalid assessment type'});
        }

        const [subjectRows] = await db.query(
            'SELECT id FROM subjects WHERE id = ?',
            [subject_id] 
        );
        if(subjectRows.length === 0) {
            return res.status(400).json({ error:'subject not found'});
        }

        const [result] = await db.query(
            `INSERT INTO assessments
            (subject_id, type, score_obtained, total_marks, assessment_date)
            VALUES (?,?,?,?,?)`,
            [subject_id, type, score_obtained, total_marks, assessment_date]
        );

        res.status(201).json({
            message: 'assessment created successfully',
            assessmentId : 'result.insertId'
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error:'Database error'})
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})