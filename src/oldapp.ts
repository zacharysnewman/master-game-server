// const express = require("express");
// const app = express();

// type Player = {
//   isHost: boolean;
//   name: string;
//   ip: string;
//   port: number | string;
// };
// type Room = { name: string; size: number; players: Player[] };
// type Callback = (req, res) => unknown;

// const gameList: Callback = (req, res) => {
//   res.send({ data: "games" });
// };

// const joinGame: Callback = (req, res) => {
//   res.send({ data: "join" });
// };

// const hostGame: Callback = (req, res) => {
//   res.send({ data: "host" });
// };

// const heartbeat: Callback = (req, res) => {
//   res.send({ data: "host" });
// };

// const appHandle = (handle: string) => (callback: Callback) =>
//   app.all(handle, callback);

// const handleGetGames = () => appHandle("/games")(gameList);
// const handleJoinGame = () => appHandle("/join")(joinGame);
// const handleHostGame = () => appHandle("/host")(hostGame);
// const handleHeartbeat = () => appHandle("/heartbeat");

// const listenForConnections = (port: string | number) =>
//   app.listen(port, () => console.log(`App listening at ${port}`));

// let allRooms: Room[] = [];

// const addRoom = (name: string) => (size: number) => (host: Player): Room => ({
//   name,
//   size,
//   players: [host],
// });

// const updateRoom = (name: string) => (size: number) => (
//   host: Player
// ): Room => ({
//   name,
//   size,
//   players: [host],
// });

// const removeRoom = (host: Player) => (rooms: Room[]): Room[] =>
//   rooms.filter(hostFromRoom(host));
// const hostFromRoom = (host: Player) => (room: Room): boolean =>
//   hostFromPlayers(host)(room.players);
// const hostFromPlayers = (host: Player) => (players: Player[]): boolean =>
//   players.find(hostOnly) == host;
// const hostOnly = (player: Player) => player.isHost;

// const main = () => {
//   const PORT: string | number = process.env.PORT || 3000;

//   handleGetGames();
//   handleJoinGame();
//   handleHostGame();
//   listenForConnections(PORT);
// };

// main();
