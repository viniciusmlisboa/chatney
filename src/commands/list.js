const { info } = require("../utils/chatFormat");

module.exports = (rooms, allClients, client) => {
  const usersInRoom = allClients
    .filter((c) => c.room == client.room && c.username)
    .map((c) => c.username)
    .filter(Boolean)
    .join(" | ");
  client.socket.write(info(`usuários online nesta sala: ${usersInRoom}.`));
};
