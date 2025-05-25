module.exports = (rooms, allClients, client, args) => {
  if (args[1]) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] não é permitido o uso de espaços no nome da sala.\x1b[0m\n`
    );
    return;
  }

  if (!client.authenticated) {
    client.socket.write(
      "Você precisa fazer login com /login seu_nome para entrar em uma sala.\x1b[0m\n"
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

  client.socket.write(
    `\x1b[1m\x1b[36m[chatney] você entrou na sala ${roomName}.\x1b[0m\n`
  );

  const users = allClients.filter(
    (c) => c.username !== client.username && c.room === roomName
  );

  for (const user of users) {
    user.socket.write(
      `\x1b[1m\x1b[36m[chatney] usuário ${client.username} entrou na sala.\x1b[0m\n`
    );
  }
};
