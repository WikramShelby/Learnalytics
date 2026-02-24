const express = require('express');
const db = require('./config/db');

const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Learnlytics Backend Running');
});

app.get('/students',async (req,res)=>{
    try {
        const [rows] = await db.query('SELECT * FROM students')
        res.json(rows);
    } catch(err) {
        console.log(error);
        res.status(500).json({error: 'database error'});
    }
});

app.post('/students',async(req,res)=>{
    try {
        const {name,email,target_cgpa} = req.body;

        if(!name || !email) {
            return res.status(400).json({error: 'name and email are required'});
        }
        const [result] = await db.query(
            'INSERT INTO students (name,email,target_cgpa) VALUES (?,?,?)',
            [name,email,target_cgpa]     
        );

        res.status(201).json({
            message: 'Student created successfully',
            studentId: result.insertId
        });
    }  catch(err) {
        console.error(err);
        res.status(500).json({error: 'database error'});
    }
});

const PORT = 3000;

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})