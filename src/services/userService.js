const db = require("../database/db");

function create(username, password, current_room) {
  try {
    const query = db.prepare(
      "INSERT INTO users (username, password, current_room) VALUES (?, ?, ?)"
    );
    const result = query.run(username, password, current_room);
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

function changeCurrentRoom(room, username) {
  const query = db.prepare(
    "UPDATE users SET current_room = ? WHERE username = ?"
  );
  return query.run(room, username);
}

module.exports = {
  create,
  getByUsername,
  changeCurrentRoom,
};
