const userService = require("../services/userService");

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

  const userAlreadyExists = userService.getByUsername(username);

  if (userAlreadyExists) {
    client.socket.write(info("nome de usuário indisponível."));
    return;
  }

  userService.create(username, password);
  client.username = username;
  client.authenticated = true;

  client.socket.write(info("boas vindas ao chatney"));
};
