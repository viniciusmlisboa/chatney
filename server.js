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
      console.log("Room inexistente, criando...");
      rooms[roomName] = new Set();
    }

    rooms[client.room].delete(client);
    client.room = roomName;
    rooms[roomName].add(client);
    return;
  },
  "/whisper": () => {},
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

      console.log(`Mensagem recebida ${message}`);

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
          c.socket.write(`[${client.room} @ [${client.username}] ${message}\n`);
        }
      }
    });
  })
  .listen(3118, () => console.log("Servidor escutando na porta 3118"));
