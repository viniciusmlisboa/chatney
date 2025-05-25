const userService = require("../services/userService");
const { info } = require("../utils/chatFormat");

module.exports = (rooms, allClients, client, args) => {
  if (client.authenticated) {
    client.socket.write(info(`você já está logado em ${client.username}.`));
    return;
  }

  if (args.length == 0 || args.length > 2) {
    client.socket.write(info("o comando está incorreto."));
    return;
  }

  const username = args[0];
  const password = args[1];

  const user = userService.getByUsername(username);

  if (!user) {
    client.socket.write(info("usuário inválido ou inexistinte."));
    return;
  }

  if (user.password !== password) {
    client.socket.write(info("senha incorreta, tente novamente!"));
    return;
  }

  client.username = username;
  client.authenticated = true;
  client.socket.write(info("que bom te ver de novo!"));
};
