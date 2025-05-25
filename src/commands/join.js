const roomService = require("../services/roomService");
const userService = require("../services/userService");
const { info } = require("../utils/chatFormat");

module.exports = (rooms, allClients, client, args) => {
  if (args[1]) {
    client.socket.write(
      info("não é permitido o uso de espaços no nome da sala.")
    );
    return;
  }

  if (!client.authenticated) {
    client.socket.write(
      info(
        "Você precisa fazer login com /login seu_nome para entrar em uma sala."
      )
    );
    return;
  }

  const roomName = args[0];

  if (!(roomName in rooms)) {
    console.log("[LOG] Room inexistente, criando...");
    rooms[roomName] = new Set();
    roomService.create(roomName);
  }

  rooms[client.room].delete(client);
  client.room = roomName;
  rooms[roomName].add(client);

  userService.changeCurrentRoom(roomName, client.username);

  client.socket.write(info(`você entrou na sala ${roomName}.`));

  const users = allClients.filter(
    (c) => c.username !== client.username && c.room === roomName
  );

  for (const user of users) {
    user.socket.write(info(`usuário ${client.username} entrou na sala.`));
  }
};
