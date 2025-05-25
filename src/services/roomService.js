const db = require("../database/db");

function create(name) {
  try {
    const stmt = db.prepare("INSERT INTO rooms (name) VALUES (?)");
    const result = stmt.run(name);
    return result.lastInsertRowid;
  } catch (err) {
    if (err.code == "SQLITE_CONSTRAINT_UNIQUE") {
      throw err;
    }
  }
}

function getByName(name) {
  const stmt = db.prepare("SELECT * FROM rooms WHERE name = ?");
  return stmt.get(name);
}

function getAllRooms() {
  const stmt = db.prepare("SELECT * FROM rooms");
  return stmt.all();
}

function getUsersInRoom(name) {
  const stmt = db.prepare("SELECT * from users WHERE current_room = ?");
  return stmt.all(name);
}

module.exports = {
  create,
  getByName,
  getAllRooms,
  getUsersInRoom,
};
