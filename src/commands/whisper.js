const userService = require("../services/userService");
const blockService = require("../services/blockService");

module.exports = (rooms, allClients, client, args) => {
  const [destName, ...messageParts] = args;
  const message = messageParts.join(" ");

  const dest = userService.getByUsername(destName);

  if (!dest) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] usuário ${destName} não encontrado.\x1b[0m\n`
    );
    return;
  }

  const iAmBlocked = blockService.isBlocked(destName, client.username);

  if (iAmBlocked) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] você não pode mandar mensagens privadas a ${destName} porque você está bloqueado.\x1b[0m\n`
    );
    return;
  }

  const destClient = allClients.find((c) => c.username === dest.username);
  destClient.socket.write(`[direct de ${client.username}] ${message}`);
};
