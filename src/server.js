const net = require("net");
const fs = require("fs");
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
      blockedUsers: new Set(),
    };

    rooms["geral"].add(client);
    clients.push(client);

    socket.write(
      "\x1b[1m\x1b[36m[chatney] digite /login seu_nome para entrar no chat.\x1b[0m\n"
    );

    socket.on("data", (data) => {
      const message = data.toString().trim();

      console.log(`[LOG] Mensagem recebida: ${message}`);

      if (message.startsWith("/")) {
        const [command, ...args] = message.split(" ");
        console.log(command);
        const handler = commands[command];

        if (!handler) {
          socket.write(
            "\x1b[1m\x1b[36m[chatney] comando não reconhecido.\x1b[0m\n"
          );
          return;
        }

        handler(rooms, clients, client, args);
        return;
      }

      if (!client.authenticated) {
        socket.write(
          "\x1b[1m\x1b[36m[chatney] Você precisa fazer login com /login seu_nome\x1b[0m\n"
        );
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
