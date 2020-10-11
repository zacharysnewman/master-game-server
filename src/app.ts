const express = require("express");
const app = express();

type Callback = (req, res) => unknown;

const appHandle = (handle: string) => (callback: Callback) =>
  app.all(handle, callback);

const handleHeartbeats = () => appHandle("/heartbeat")(heartbeat);

const listenForConnections = (port: string | number) =>
  app.listen(port, () => console.log(`App listening at ${port}`));

//
type Player = {
  name: string;
  ip: string; 
  port: number | string;
  lastHeartbeat: number;
};

const PLAYER_TIMEOUT = 10000; // ms
let allPlayers: Player[] = [];

const heartbeat: Callback = (req, res) => {
  const now = Date.now();

  const thisPlayer: Player = { 
    name: req.query.playerName, 
    ip: req.connection.remoteAddress, 
    port: req.connection.remotePort, 
    lastHeartbeat: now 
  };

  const playerIndex = findPlayerIndex(allPlayers)(thisPlayer);

  if (playerIndex) {
    allPlayers[playerIndex] = thisPlayer;
  } else {
    allPlayers.push(thisPlayer);
  }

  // allPlayers = allPlayers.filter(playersWithRecentHeartbeats(now));
  
  res.send(JSON.stringify(allPlayers));
};

const includesPlayer = (players: Player[]) => (player: Player) => !!players.find((x) => x.ip === player.ip && x.port === player.port);
const findPlayerIndex = (players: Player[]) => (player: Player) => players.findIndex((x) => x.ip === player.ip && x.port === player.port);
const allPlayersExceptThisOne = (player: Player) => allPlayers.filter((x) => x !== player);

const playersWithRecentHeartbeats = (now: number) => (player: Player) =>
  now - player.lastHeartbeat < PLAYER_TIMEOUT;

const main = () => {
  const PORT: string | number = process.env.PORT || 3000;

  handleHeartbeats();
  listenForConnections(PORT);
};

main();
