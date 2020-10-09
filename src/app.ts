const express = require("express");
const app = express();

type Callback = (req, res) => unknown;

const appHandle = (handle: string) => (callback: Callback) =>
  app.all(handle, callback);

const handleHeartbeat = () => appHandle("/heartbeat")(heartbeat);

const listenForConnections = (port: string | number) =>
  app.listen(port, () => console.log(`App listening at ${port}`));

//
type Player = {
  name: string;
  remote:{ ip: string,
  port: number | string };
  local: { ip:string, port: number|string};
  lastHeartbeat: number;
};

const PLAYER_TIMEOUT = 10000; // ms
let players: Player[] = [];

const heartbeat: Callback = (req, res) => {
  const name = req.query.playerName;
  const remoteIp = req.connection.remoteAddress;
  const remotePort = req.connection.remotePort;
  const localIp = req.connection.localAddress;
  const localPort = req.connection.localPort;
  const now = Date.now();

  const thisPlayer: Player = { name, remote: { ip: remoteIp, port: remotePort }, local: { ip: localIp, port: localPort }, lastHeartbeat: now };

  // Maybe update this search to only check for ip/port
  if (players.includes(thisPlayer)) {
    // Update player's heartbeat, etc. (and maybe name)
  } else {
    players.push(thisPlayer);
  }

  players = players.filter(playerFilter(now));

  const playersWithoutThisPlayer = players;//players.filter(
  //   (player) => player !== thisPlayer
  // );

  res.send(JSON.stringify(playersWithoutThisPlayer));
};

const playerFilter = (now: number) => (player: Player) =>
  now - player.lastHeartbeat < PLAYER_TIMEOUT;

const main = () => {
  const PORT: string | number = process.env.PORT || 3000;

  handleHeartbeat();
  listenForConnections(PORT);
};

main();
