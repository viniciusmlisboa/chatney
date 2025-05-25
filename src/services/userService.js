const db = require("./database/db");

function create(username) {
  try {
    const query = db.prepare("INSERT INTO users (username) VALUES (?");
    const result = query.run(username);
    return result.lastInsertRowid;
  } catch (err) {
    if (err.code == "SQLITE_CONSTRAINT_UNIQUE") {
      throw err;
    }
  }
}

function getByUsername(username) {
  const query = db.prepare("SELECT * FROM users WHERE username = ?");
  return query.run(username);
}

module.exports = {
  create,
  getByUsername,
};
