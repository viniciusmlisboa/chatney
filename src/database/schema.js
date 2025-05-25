const db = require("./db");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        current_room TEXT,
        FOREIGN KEY(current_room) REFERENCES rooms(name)
    );

    CREATE TABLE IF NOT EXISTS blocked_users (
        blocker TEXT,
        blocked TEXT,
        PRIMARY KEY (blocker, blocked),
        FOREIGN KEY (blocker) REFERENCES users(username)
        FOREIGN KEY (blocked) REFERENCES users(username)
    );

    CREATE TABLE IF NOT EXISTS rooms (
        name TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO rooms (name) VALUES ('geral');
`);

console.log("Esquema criado com sucesso.");
