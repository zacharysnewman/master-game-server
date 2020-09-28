const express = require("express");
const app = express();

type Player = { name: string; ip: string; port: number | string };
type Room = { roomName: string; roomSize: string; players: Player[] };
type Callback = (req, res) => void;

// Unused so far...
const newRoom = (roomName: string, roomSize: string, host: Player): Room => ({
  roomName,
  roomSize,
  players: [host],
});

const appHandle = (handle: string) => (callback: Callback) =>
  app.all(handle, callback);

const gameList: Callback = (req, res) => {
  res.send({ data: "games" });
};

const joinGame: Callback = (req, res) => {
  res.send({ data: "join" });
};

const hostGame: Callback = (req, res) => {
  res.send({ data: "hostGame" });
};

const handleGetGames = () => appHandle("/games")(gameList);
const handleJoinGame = () => appHandle("/join")(joinGame);
const handleHostGame = () => appHandle("/host")(hostGame);

const listenForConnections = (port: string | number) =>
  app.listen(port, () => console.log(`App listening at ${port}`));

const main = () => {
  const PORT: string | number = process.env.PORT || 3000;

  handleGetGames();
  handleJoinGame();
  handleHostGame();
  listenForConnections(PORT);
};

main();
