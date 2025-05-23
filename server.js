const net = require("net");
const commands = require("./commands.js");

const clients = [];

const rooms = {
  geral: new Set(),
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
