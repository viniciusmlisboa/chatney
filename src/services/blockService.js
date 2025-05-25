const db = require("./database/db");

function blockUser(blocker, blocked) {
  const stmt = db.prepare(
    `INSERT INTO blocked_users (blocker, blocked) VALUES (?, ?)`
  );
  stmt.run(blocker, blocked);
}

function unblockUser(blocker, blocked) {
  const stmt = db.prepare(
    `DELETE FROM blocked_users WHERE blocker = ? AND blocked = ?`
  );
  stmt.run(blocker, blocked);
}

function isBlocked(blocker, blocked) {
  const stmt = db.prepare(`
    SELECT 1 FROM blocked_users WHERE blocker = ? AND blocked = ? 
  `);
  return !!stmt.get(blocker, blocked);
}

function listBlockedUsers(blocker) {
  const stmt = db.prepare(`SELECT * FROM blocked_users WHERE blocker = ?`);
  return stmt.all(blocker);
}

module.exports = {
  blockUser,
  unblockUser,
  isBlocked,
  listBlockedUsers,
};
