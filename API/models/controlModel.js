const db = require('../db-conn');

exports.getControl = (callback) => {
  db.query('SELECT * FROM control WHERE id = 1', callback);
};

exports.updateControl = (user, acquiredAt, callback) => {
  db.query('UPDATE control SET user = ?, acquiredAt = ? WHERE id = 1', [user, acquiredAt], callback);
};

exports.releaseControl = (callback) => {
  db.query('UPDATE control SET user = NULL, acquiredAt = NULL WHERE id = 1', callback);
};
