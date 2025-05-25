module.exports = (rooms, allClients, client) => {
  const usersInRoom = allClients
    .filter((c) => c.room == client.room && c.username)
    .map((c) => c.username)
    .filter(Boolean)
    .join(" | ");
  client.socket.write(
    `\x1b[1m\x1b[36m[chatney] usuários online nesta sala: ${usersInRoom}.\x1b[0m\n`
  );
};
