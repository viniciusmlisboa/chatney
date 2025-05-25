const db = require("./db");

db.exec(`
  DROP TABLE IF EXISTS blocked_users;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS rooms;
`);

require("./schema"); // recria as tabelas
