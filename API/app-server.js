

// // const express = require('express');
// // const cors = require('cors');
// // const app = express();
// // const PORT = 3000;

// // app.use(cors());
// // app.use(express.json());

// // let keys = Array(10).fill(null); 
// // let control = {
// //   user: null,
// //   acquiredAt: null
// // };

// // function releaseControl() {
// //   control.user = null;
// //   control.acquiredAt = null;
// // }

// // app.post('/acquire', (req, res) => {
// //   const { user } = req.body;
// //   const now = Date.now();

// //   if (control.user && now - control.acquiredAt > 120000) {
// //     releaseControl();
// //   }

// //   if (!control.user) {
// //     control.user = user;
// //     control.acquiredAt = now;
// //     return res.json({ success: true });
// //   }

// //   res.json({ success: false, control });
// // });

// // app.post('/release', (req, res) => {
// //   releaseControl();
// //   res.json({ success: true });
// // });

// // app.post('/update', (req, res) => {
// //   const { index, user } = req.body;
// //   if (keys[index] === user) {
// //     keys[index] = null;
// //   } else {
// //     keys[index] = user; 
// //   }
// //   releaseControl(); 
// //   res.json({ success: true });
// // });

// // app.get('/state', (req, res) => {
// //   const now = Date.now();
// //   if (control.user && now - control.acquiredAt > 120000) {
// //     releaseControl();
// //   }
// //   res.json({ keys, control });
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // });






// // // const express       = require('express');
// // // const mysql         = require('mysql2');
// // // const bodyParser    = require('body-parser');

// // // const app = express();

// // // app.use(bodyParser.json());

// // // const connection = mysql.createConnection({
// // //   host: 'localhost',
// // //   user: 'root',         
// // //   password: 'Admin@123', 
// // //   database: 'KeyBoardDB'    
// // // });

// // // connection.connect((err) => {
// // //   if (err) {
// // //     console.error('Error connecting to MySQL:', err.stack);
// // //     return;
// // //   }
// // //   console.log('Database Connected');
// // // });

// // // app.get('/users', (req, res) => {
// // //   connection.query('SELECT * FROM users', (err, results) => {
// // //     if (err) {
// // //       return res.status(500).json({ error: 'Error fetching users' });
// // //     }
// // //     res.status(200).json(results);
// // //   });
// // // });

// // // const PORT = process.env.PORT || 3000;
// // // app.listen(PORT, () => {
// // //   console.log(`Server is running on port ${PORT}`);
// // // });


// const express = require('express');
// const cors = require('cors');
// const mysql = require('mysql2');
// const app = express();
// const PORT = 3000;

// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Admin@123',
//   database: 'KeyBoardDB'
// });

// db.connect(err => {
//   if (err) {
//     console.error('MySQL connection error:', err.stack);
//     return;
//   }
//   console.log('Connected to MySQL');
// });

// function releaseControl(callback) {
//   db.query(
//     'UPDATE control SET user = NULL, acquiredAt = NULL WHERE id = 1',
//     callback
//   );
// }

// app.post('/api/acquire', (req, res) => {
//   const { user } = req.body;
//   const now = Date.now();

//   db.query('SELECT * FROM control WHERE id = 1', (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const control = results[0];
//     if (control.user && now - control.acquiredAt > 120000) {
//       releaseControl(() => {
//         db.query(
//           'UPDATE control SET user = ?, acquiredAt = ? WHERE id = 1',
//           [user, now],
//           () => res.json({ success: true })
//         );
//       });
//     } else if (!control.user) {
//       db.query(
//         'UPDATE control SET user = ?, acquiredAt = ? WHERE id = 1',
//         [user, now],
//         () => res.json({ success: true })
//       );
//     } else {
//       res.json({ success: false, control });
//     }
//   });
// });

// app.post('/api/release', (req, res) => {
//   releaseControl(() => res.json({ success: true }));
// });

// app.post('/api/update', (req, res) => {
//   const { index, user } = req.body;

//   db.query('SELECT state FROM keyState WHERE id = ?', [index], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const current = results[0].state;
//     const newState = current === user ? null : user;

//     db.query('UPDATE keyState SET state = ? WHERE id = ?', [newState, index], (err2) => {
//       if (err2) return res.status(500).json({ error: err2.message });

//       releaseControl(() => res.json({ success: true }));
//     });
//   });
// });

// app.get('/api/state', (req, res) => {
//   const now = Date.now();

//   db.query('SELECT * FROM control WHERE id = 1', (err, controlResults) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const control = controlResults[0];
//     if (control.user && now - control.acquiredAt > 120000) {
//       return releaseControl(() => {
//         db.query('SELECT state FROM keyState ORDER BY id', (err2, keyResults) => {
//           if (err2) return res.status(500).json({ error: err2.message });

//           res.json({ keys: keyResults.map(k => k.state), control: { user: null, acquiredAt: null } });
//         });
//       });
//     }

//     db.query('SELECT state FROM keyState ORDER BY id', (err2, keyResults) => {
//       if (err2) return res.status(500).json({ error: err2.message });

//       res.json({ keys: keyResults.map(k => k.state), control });
//     });
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/routes');

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



