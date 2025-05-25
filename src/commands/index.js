const nonAuthCommands = ["/login", "/signin"];

function authWrapper(commandName, handler) {
  console.log(commandName);
  return (rooms, allClients, client, args) => {
    if (!nonAuthCommands.includes("/" + commandName) && !client.authenticated) {
      client.socket.write(
        `\x1b[1m\x1b[36m[chatney] você precisa estar logado para usar esse comando.\x1b[0m\n`
      );
      return;
    }
    handler(rooms, allClients, client, args);
  };
}

module.exports = {
  "/signin": authWrapper("signin", require("./signin")),
  "/login": authWrapper("login", require("./login")),
  "/logout": authWrapper("logout", require("./logout")),
  "/join": authWrapper("join", require("./join")),
  "/whisper": authWrapper("whisper", require("./whisper")),
  "/block": authWrapper("block", require("./block")),
  "/unblock": authWrapper("unblock", require("./unblock")),
  "/list": authWrapper("list", require("./list")),
};
