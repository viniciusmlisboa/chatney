const db = require("../database/db");

function create(username, password) {
  try {
    const query = db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    );
    const result = query.run(username, password);
    return result.lastInsertRowid;
  } catch (err) {
    if (err.code == "SQLITE_CONSTRAINT_UNIQUE") {
      throw err;
    }
  }
}

function getByUsername(username) {
  const query = db.prepare("SELECT * FROM users WHERE username = ?");
  return query.get(username);
}

module.exports = {
  create,
  getByUsername,
};
