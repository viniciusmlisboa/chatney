const userService = require("./services/userService");
const blockService = require("./services/blockService");

const commands = {
  "/login": (rooms, allClients, client, args) => {
    if (args[1]) {
      client.socket.write(
        `\x1b[1m\x1b[36m[chatney] não é permitido o uso de espaços no nome.\x1b[0m\n`
      );
      return;
    }

    if (!args[0]) {
      client.socket.write(
        `\x1b[1m\x1b[36m[chatney] você precisa inserir um nome.\x1b[0m\n`
      );
      return;
    }

    // const userAlreadyExists = allClients.find((c) => c.username == args[0]);
    const userAlreadyExists = userService.getByUsername(args[0]);

    if (userAlreadyExists) {
      client.socket.write(
        `\x1b[1m\x1b[36m[⚠️  chatney] nome de usuário indisponível.\x1b[0m\n`
      );
      return;
    }

    client.username = args[0];
    client.authenticated = true;

    console.log(userService.create(args[0]));
    client.socket.write(
      `\x1b[1m\x1b[36m[chatney] agora você conversar ${client.username}!\x1b[0m\n`
    );
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
