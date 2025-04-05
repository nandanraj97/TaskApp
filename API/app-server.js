

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let keys = Array(10).fill(null); 
let control = {
  user: null,
  acquiredAt: null
};

function releaseControl() {
  control.user = null;
  control.acquiredAt = null;
}

app.post('/acquire', (req, res) => {
  const { user } = req.body;
  const now = Date.now();

  if (control.user && now - control.acquiredAt > 120000) {
    releaseControl();
  }

  if (!control.user) {
    control.user = user;
    control.acquiredAt = now;
    return res.json({ success: true });
  }

  res.json({ success: false, control });
});

app.post('/release', (req, res) => {
  releaseControl();
  res.json({ success: true });
});

app.post('/update', (req, res) => {
  const { index, user } = req.body;
  if (keys[index] === user) {
    keys[index] = null;
  } else {
    keys[index] = user; 
  }
  releaseControl(); 
  res.json({ success: true });
});

app.get('/state', (req, res) => {
  const now = Date.now();
  if (control.user && now - control.acquiredAt > 120000) {
    releaseControl();
  }
  res.json({ keys, control });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});






// const express       = require('express');
// const mysql         = require('mysql2');
// const bodyParser    = require('body-parser');

// const app = express();

// app.use(bodyParser.json());

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',         
//   password: 'Admin@123', 
//   database: 'KeyBoardDB'    
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err.stack);
//     return;
//   }
//   console.log('Database Connected');
// });

// app.get('/users', (req, res) => {
//   connection.query('SELECT * FROM users', (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error fetching users' });
//     }
//     res.status(200).json(results);
//   });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

