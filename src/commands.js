const userService = require("./services/userService");
const blockService = require("./services/blockService");

const commands = {
  "/signin": (rooms, allClientes, client, args) => {
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
  },
  "/login": (rooms, allClients, client, args) => {
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
  },
  "/logout": (rooms, allClientes, client, args) => {
    const roomUsers = allClientes.filter(
      (c) => c.room === client.room && c !== client
    );

    for (const user of roomUsers) {
      user.socket.write(
        `\x1b[1m\x1b[36m[chatney] ${client.username} saiu do chat.\x1b[0m\n`
      );
    }

    client.username = null;
    client.authenticated = false;
    rooms[client.room]?.delete(client);
    client.room = "geral";
    client.blockedUsers = new Set();

    client.socket.write(`\x1b[1m\x1b[36m[chatney] até a próxima!\x1b[0m\n`);
  },
  "/join": (rooms, allClients, client, args) => {
    if (args[1]) {
      client.socket.write(
        `\x1b[1m\x1b[36m[chatney] não é permitido o uso de espaços no nome da sala.\x1b[0m\n`
      );
      return;
    }

    if (!client.authenticated) {
      client.socket.write(
        "Você precisa fazer login com /login seu_nome para entrar em uma sala.\x1b[0m\n"
      );
      return;
    }

    const roomName = args[0];

    if (!(roomName in rooms)) {
      console.log("[LOG] Room inexistente, criando...");
      rooms[roomName] = new Set();
    }

    rooms[client.room].delete(client);
    client.room = roomName;
    rooms[roomName].add(client);

    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] você entrou na sala ${roomName}.\x1b[0m\n`
    );

    const users = allClients.filter(
      (c) => c.username !== client.username && c.room === roomName
    );

    for (const user of users) {
      user.socket.write(
        `\x1b[1m\x1b[36m[chatney] usuário ${client.username} entrou na sala.\x1b[0m\n`
      );
    }
    return;
  },
  "/whisper": (rooms, allClients, client, args) => {
    const [destName, ...messageParts] = args;
    const message = messageParts.join(" ");
    // const dest = allClients.find((c) => c.username === destName);

    const dest = userService.getByUsername(destName);

    if (!dest) {
      client.socket.write(
        `\x1b[1m\x1b[36m[chatney] usuário ${destName} não encontrado.\x1b[0m\n`
      );
      return;
    }

    const iAmBlocked = blockService.isBlocked(destName, client.username);

    // if (dest.blockedUsers.has(client.username)) {
    if (iAmBlocked) {
      client.socket.write(
        `\x1b[1m\x1b[36m[chatney] você não pode mandar mensagens privadas a ${destName} porque você está bloqueado.\x1b[0m\n`
      );
      return;
    }

    dest.socket.write(`[direct de ${client.username}] ${message}`);
  },
  "/block": (rooms, allClients, client, args) => {
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
  },
  "/unblock": (rooms, allClients, client, args) => {
    if (!args[0]) {
      client.socket.write(
        `\x1b[1m\x1b[36m[chatney] você precisa inserir um nome.\x1b[0m\n`
      );
      return;
    }

    const usernameToUnblock = args[0];
    // const clientToUnblock = allClients.find(
    //   (c) => c.username === usernameToUnblock
    // );

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

    // if (!client.blockedUsers.has(usernameToUnblock)) {
    //   client.socket.write(
    //     `\x1b[1m\x1b[36m[chatney] usuário ${usernameToUnblock} não está bloqueado por você.`
    //   );
    //   return;
    // }

    // client.blockedUsers.delete(usernameToUnblock);

    blockService.unblockUser(usernameToUnblock);
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] o usuário ${usernameToUnblock} foi desbloqueado.\x1b[0m\n`
    );
  },
  "/list": (rooms, allClients, client) => {
    const usersInRoom = allClients
      .filter((c) => c.room == client.room && c.username)
      .map((c) => c.username)
      .filter(Boolean)
      .join(" | ");
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] usuários online nesta sala: ${usersInRoom}.\x1b[0m\n`
    );
  },
};

module.exports = commands;
