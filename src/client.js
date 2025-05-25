const net = require("net");
const readline = require("readline");

let myUsername = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

const client = net.createConnection({ port: 3118 }, () => {
  console.log("Conectado ao chat");
  rl.prompt();
});

client.on("data", (data) => {
  const message = `${data.toString().trim()}`;

  console.log(message);
  rl.prompt();
});

rl.on("line", (line) => {
  if (line.startsWith("/login ")) {
    myUsername = line.split(" ")[1];
  }

  client.write(line);
  rl.prompt();
});
