const userService = require("../services/userService");
const blockService = require("../services/blockService");
const { info } = require("../utils/chatFormat");

module.exports = (rooms, allClients, client, args) => {
  if (!args[0]) {
    client.socket.write(info("você precisa inserir um nome."));
    return;
  }

  const usernameToBlock = args[0];

  const clientToBlock = userService.getByUsername(usernameToBlock);

  if (!clientToBlock) {
    client.socket.write(info(`usuário ${usernameToBlock} não encontrado.`));
    return;
  }

  // client.blockedUsers.add(usernameToBlock);
  blockService.blockUser(client.username, usernameToBlock);

  client.socket.write(
    info(
      `usuário ${usernameToBlock} foi bloqueado e não poderá mandar mensagens privadas.`
    )
  );
};
