const { info } = require("../utils/chatFormat");

module.exports = (rooms, allClientes, client, args) => {
  const roomUsers = allClientes.filter(
    (c) => c.room === client.room && c !== client
  );

  for (const user of roomUsers) {
    user.socket.write(info(`${client.username} saiu do chat.`));
  }

  client.username = null;
  client.authenticated = false;

  rooms[client.room]?.delete(client);

  client.socket.write(info("até a próxima!"));
};
