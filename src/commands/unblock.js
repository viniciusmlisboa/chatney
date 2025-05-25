const blockService = require("../services/blockService");

module.exports = (rooms, allClients, client) => {
  if (!args[0]) {
    client.socket.write(info("você precisa inserir um nome."));
    return;
  }

  const usernameToUnblock = args[0];

  const clientToUnblock = blockService.isBlocked(
    client.username,
    usernameToUnblock
  );

  if (!clientToUnblock) {
    client.socket.write(
      info(`usuário ${usernameToUnblock} não encontrado na lista de bloqueios.`)
    );
    return;
  }

  blockService.unblockUser(usernameToUnblock);
  client.socket.write(info(`o usuário ${usernameToUnblock} foi desbloqueado.`));
};
