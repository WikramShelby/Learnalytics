const db = require('./config/db');

async function testDB() {
    try {
        const [rows] = await db.query('SELECT * FROM students');
        console.log('Connected students',rows);
    } catch(err) {
        console.err('Database connection failed: ',err);
    }
}

testDB();