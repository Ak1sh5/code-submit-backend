
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;
var cors = require('cors')

app.use(cors())
// MySQL connection configuration
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.get('/', (req, res) => {
    console.log("Hi");
});
// Route to handle form submissions
app.post('/submit', (req, res) => {
    const { username, language, stdin, sourceCode } = req.body;
    console.log(username, language, stdin, sourceCode);
    const sql = 'INSERT INTO submissions (username, lang, stdin, source_code) VALUES (?, ?, ?, ?)';
    connection.query(sql, [username, language, stdin, sourceCode], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Error submitting form' });
            return;
        }
        console.log('Form submitted successfully');
        res.json({ message: 'Form submitted successfully' });
    });
});


// Route to fetch form submissions
app.get('/submissions', (req, res) => {
    const sql = 'SELECT * FROM submissions';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }
        res.json(results);
        console.log("success");
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
