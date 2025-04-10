const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin@123',
  database: 'KeyBoardDB'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err.stack);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

module.exports = db;
