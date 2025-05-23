const commands = {
  "/login": (client, args) => {
    if (args[1]) {
      client.socket.write(
        `[chatney] não é permitido o uso de espaços no nome.\n`
      );
      return;
    }

    if (!args[0]) {
      client.socket.write(`[chatney] você precisa inserir um nome.\n`);
      return;
    }

    client.username = args[0];
    client.authenticated = true;
    client.socket.write(`[chatney] agora você conversar ${client.username}!`);
  },
  "/join": (client, args) => {
    if (args[1]) {
      client.socket.write(
        `[chatney] não é permitido o uso de espaços no nome da sala.\n`
      );
      return;
    }

    if (!client.authenticated) {
      client.socket.write(
        "Você precisa fazer login com /login seu_nome para entrar em uma sala.\n"
      );
      return;
    }

    const roomName = args[0];

    if (!(roomName in rooms)) {
      console.log("[LOG] Room inexistente, criando...");
      rooms[roomName] = new Set();
    }

    rooms[client.room].delete(client);
    client.room = roomName;
    rooms[roomName].add(client);

    client.socket.write(`[chatney] você entrou na sala ${roomName}`);

    const users = clients.filter(
      (c) => c.username !== client.username && c.room === roomName
    );

    for (const user of users) {
      user.socket.write(
        `[chatney] usuário ${client.username} entrou na sala\n`
      );
    }
    return;
  },
  "/whisper": (client, args) => {
    const [destName, ...messageParts] = args;
    const message = messageParts.join(" ");
    const dest = clients.find((c) => c.username === destName);

    if (!dest) {
      client.socket.write(`[chatney] usuário ${destName} não encontrado`);
      return;
    }

    dest.socket.write(`[direct de ${client.username}] ${message}`);
  },
  "/list": (client) => {
    const usernames = clients
      .map((c) => c.username)
      .filter(Boolean)
      .join(" | ");
    client.socket.write(`[chatney] usuários online nesta sala: ${usernames}\n`);
  },
};

module.exports = commands;
