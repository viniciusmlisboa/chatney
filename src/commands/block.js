const userService = require("../services/userService");
const blockService = require("../services/blockService");

module.exports = (rooms, allClients, client, args) => {
  if (!args[0]) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] você precisa inserir um nome.\x1b[0m\n`
    );
    return;
  }

  const usernameToBlock = args[0];

  // const clientToBlock = allClients.find(
  //   (c) => c.username === usernameToBlock
  // );

  const clientToBlock = userService.getByUsername(usernameToBlock);

  if (!clientToBlock) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] usuário ${usernameToBlock} não encontrado.\x1b[0m\n`
    );
    return;
  }

  // client.blockedUsers.add(usernameToBlock);
  blockService.blockUser(client.username, usernameToBlock);

  client.socket.write(
    `\x1b[1m\x1b[36m[chatney] usuário ${usernameToBlock} foi bloqueado e não poderá mandar mensagens privadas.\x1b[0m\n`
  );
};
