const db = require('../db-conn');

exports.getKeyState = (id, callback) => {
  db.query('SELECT state FROM keyState WHERE id = ?', [id], callback);
};

exports.updateKeyState = (id, state, callback) => {
  db.query('UPDATE keyState SET state = ? WHERE id = ?', [state, id], callback);
};

exports.getAllKeyStates = (callback) => {
  db.query('SELECT state FROM keyState ORDER BY id', callback);
};
