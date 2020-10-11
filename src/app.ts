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

  const playerName = req.query.playerName;
  const playerIp = removeColons(removeFs(req.connection.remoteAddress));
  const playerPort = req.connection.remotePort;
  const now = Date.now();

  if(!playerName || !playerIp || !playerPort)
    return;

  const thisPlayer: Player = { 
    name: playerName,
    ip: playerIp,
    port: playerPort, 
    lastHeartbeat: now 
  };

  const playerIndex = findPlayerIndex(allPlayers)(thisPlayer);

  // console.log("Players before push:", allPlayers);

  if (playerIndex >= 0) {
    // console.log("modified");
    allPlayers[playerIndex] = thisPlayer;
  } else {
    // console.log("pushed");
    allPlayers.push(thisPlayer);
  }

  // console.log("Players after push:", allPlayers);

  allPlayers = allPlayers.filter(playersWithRecentHeartbeats(now));

  // console.log("Players after heartbeat filter:", allPlayers);
  
  res.send(JSON.stringify(allPlayers));
};

const replaceAll = (searchTerm: string) => (replacement: string) => (value: string) => value.split(searchTerm).join(replacement);
const removeColons = (value: string) => replaceAll(":")("")(value);
const removeFs = (value: string) => replaceAll("f")("")(value);

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
