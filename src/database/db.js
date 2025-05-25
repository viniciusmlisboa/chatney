const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "users.db"));

module.exports = db;
