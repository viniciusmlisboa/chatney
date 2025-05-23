const net = require("net");

const clients = [];

const rooms = {
  geral: new Set(),
};

const commands = {
  "/login": (client, args) => {
    if (args[1]) {
      client.socket.write(
        `[chatney] não é permitido o uso de espaços no nome.\n`
      );
      return;
    }

    if (!args[0]) {
      client.socket.write(`[chatney] você precisa inserir um nome.\n`);
      return;
    }

    client.username = args[0];
    client.authenticated = true;
    client.socket.write(`[chatney] agora você conversar ${client.username}!`);
  },
  "/join": (client, args) => {
    if (args[1]) {
      client.socket.write(
        `[chatney] não é permitido o uso de espaços no nome da sala.\n`
      );
      return;
    }

    if (!client.authenticated) {
      client.socket.write(
        "Você precisa fazer login com /login seu_nome para entrar em uma sala.\n"
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

    client.socket.write(`[chatney] você entrou na sala ${roomName}`);

    const users = clients.filter(
      (c) => c.username !== client.username && c.room === roomName
    );

    for (const user of users) {
      user.socket.write(
        `[chatney] usuário ${client.username} entrou na sala\n`
      );
    }
    return;
  },
  "/whisper": (client, args) => {
    const [destName, ...messageParts] = args;
    const message = messageParts.join(" ");
    const dest = clients.find((c) => c.username === destName);

    if (!dest) {
      client.socket.write(`[chatney] usuário ${destName} não encontrado`);
      return;
    }

    dest.socket.write(`[direct de ${client.username}] ${message}`);
  },
  "/list": (client) => {
    const usernames = clients
      .map((c) => c.username)
      .filter(Boolean)
      .join(" | ");
    client.socket.write(`[chatney] usuários online nesta sala: ${usernames}\n`);
  },
};

net
  .createServer((socket) => {
    const client = {
      socket,
      username: null,
      room: "geral",
      authenticated: false,
    };
    rooms["geral"].add(client);
    clients.push(client);

    socket.write("[chatney] digite /login seu_nome para entrar no chat\n");

    socket.on("data", (data) => {
      const message = data.toString().trim();

      console.log(`[LOG] Mensagem recebida: ${message}`);

      if (message.startsWith("/")) {
        const [command, ...args] = message.split(" ");
        console.log(command);
        const handler = commands[command];

        if (!handler) {
          socket.write("[chatney] comando não reconhecido.\n");
          return;
        }

        handler(client, args);
        return;
      }

      if (!client.authenticated) {
        socket.write("Você precisa fazer login com /login seu_nome\n");
        return;
      }

      for (const c of clients) {
        if (c.socket !== socket && c.username && client.room == c.room) {
          c.socket.write(`[${client.room} @ ${client.username}] ${message}\n`);
        }
      }
    });
  })
  .listen(3118, () => console.log("Servidor escutando na porta 3118"));
