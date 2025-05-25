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

  // const userAlreadyExists = allClients.find((c) => c.username == args[0]);
  const user = userService.getByUsername(username);

  if (!user) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] usuário inválido ou inexistinte.\x1b[0m\n`
    );
    return;
  }

  if (user.password !== password) {
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] senha incorreta, tente novamente!\x1b[0m\n`
    );
    return;
  }

  client.username = username;
  client.authenticated = true;
  client.socket.write(
    `\x1b[1m\x1b[36m[chatney] que bom te ver de novo!\x1b[0m\n`
  );
};
