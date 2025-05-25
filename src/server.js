const net = require("net");
const commands = require("./commands");
const { info } = require("./utils/chatFormat");

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

    socket.write(info("digite /login seu_nome para entrar no chat."));

    socket.on("data", (data) => {
      const message = data.toString().trim();

      if (message.startsWith("/")) {
        const [command, ...args] = message.split(" ");
        const handler = commands[command];

        if (!handler) {
          socket.write(info("comando não reconhecido."));
          return;
        }

        handler(rooms, clients, client, args);
        return;
      }

      if (!client.authenticated) {
        socket.write(info("Você precisa fazer login com /login seu_nome."));
        return;
      }

      for (const c of clients) {
        if (c.socket !== socket && c.username && client.room == c.room) {
          c.socket.write(`[${client.room} @ ${client.username}] ${message}\n`);
        }
      }
    });

    socket.on("end", () => {
      clients.splice(clients.indexOf(socket), 1);
      console.log("[LOG] Cliente desconectado");
    });

    socket.on("error", (err) => {
      console.log("[LOG] Erro no cliente:", err.message);
    });
  })
  .listen(3118, () => console.log("Servidor escutando na porta 3118"));
