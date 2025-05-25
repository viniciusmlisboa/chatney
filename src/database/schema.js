const db = require("./db");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blocked_users (
        blocker TEXT,
        blocked TEXT,
        PRIMARY KEY (blocker, blocked),
        FOREIGN KEY (blocker) REFERENCES users(username)
        FOREIGN KEY (blocked) REFERENCES users(username)
    );
`);

console.log("Esquema criado com sucesso.");
