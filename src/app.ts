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

const replaceAll = (searchTerm: string) => (replacement: string) => (value: string) => value.split(searchTerm).join(replacement);
const removeColons = (value: string) => replaceAll(":")("")(value);
const removeFs = (value: string) => replaceAll("f")("")(value);

const isPlayer = (player: Player) => (x: Player) => x.ip === player.ip && x.name === player.name;
const isNotPlayer = (player: Player) => (x: Player) => !isPlayer(player)(x);
const includesPlayer = (players: Player[]) => (player: Player) => !!players.find(isPlayer(player));
const findPlayerIndex = (players: Player[]) => (player: Player) => players.findIndex(isPlayer(player));
const allPlayersExceptThisPlayer = (players: Player[]) => (player: Player) => players.filter(isNotPlayer(player));

const updatePlayer = (newPlayerData: Player) => (playerToUpdate: Player) => ({...playerToUpdate, lastHeartbeat: newPlayerData.lastHeartbeat});

const playersWithRecentHeartbeats = (now: number) => (player: Player) => 
  now - player.lastHeartbeat < PLAYER_TIMEOUT;

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

  if (playerIndex >= 0) {
    allPlayers[playerIndex] = updatePlayer(thisPlayer)(allPlayers[playerIndex]);
  } else {
    allPlayers.push(thisPlayer);
  }

  allPlayers = allPlayers.filter(playersWithRecentHeartbeats(now));
  
  res.send(JSON.stringify(allPlayers));
};

const main = () => {
  const PORT: string | number = process.env.PORT || 3000;

  handleHeartbeats();
  listenForConnections(PORT);
};

main();
