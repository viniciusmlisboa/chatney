const blockService = require("../services/blockService");

module.exports = (rooms, allClients, client) => {
  if (!args[0]) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] você precisa inserir um nome.\x1b[0m\n`
    );
    return;
  }

  const usernameToUnblock = args[0];

  const clientToUnblock = blockService.isBlocked(
    client.username,
    usernameToUnblock
  );

  if (!clientToUnblock) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] usuário ${usernameToUnblock} não encontrado na lista de bloqueios.\x1b[0m\n`
    );
    return;
  }

  blockService.unblockUser(usernameToUnblock);
  client.socket.write(
    `\x1b[1m\x1b[36m[chatney] o usuário ${usernameToUnblock} foi desbloqueado.\x1b[0m\n`
  );
};
