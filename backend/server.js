const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow requests from any port
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json()); // Built-in body parser

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AP03AL8449', // or empty string '' if that's your setup
  database: 'pikfusion',
});

db.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('MySQL Connected...');
});

// API endpoint
app.post('/api/contact', (req, res) => {
  console.log('Incoming POST request:', req.body);

  const { fullName, email, message } = req.body;

  if (!fullName || !email || !message) {
    console.log('Validation failed');
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO contacts (full_name, email, message) VALUES (?, ?, ?)';
  db.query(query, [fullName, email, message], (err, result) => {
    if (err) {
      console.error('Insert failed:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('Contact inserted:', result);
    res.status(200).json({ success: 'Message sent successfully!' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
