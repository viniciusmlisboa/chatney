const userService = require("../services/userService");

module.exports = (rooms, allClients, client, args) => {
  if (client.authenticated) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] você já está logado em ${client.username}.\x1b[0m\n`
    );
    return;
  }

  if (args.length == 0 || args.length > 2) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] o comando está incorreto.\x1b[0m\n`
    );
    return;
  }

  const username = args[0];
  const password = args[1];

  const userAlreadyExists = userService.getByUsername(username);

  if (userAlreadyExists) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] nome de usuário indisponível.\x1b[0m\n`
    );
    return;
  }

  userService.create(username, password);
  client.username = username;
  client.authenticated = true;

  client.socket.write(
    `\x1b[1m\x1b[36m[chatney] boas vindas ao chatney!\x1b[0m\n`
  );
};
