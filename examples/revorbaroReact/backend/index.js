const { strummuluServerFactory, GAME_TYPES, Server, gameRoomFactory } = require('strummulu-server');
const RevorbaroGameLogic = require('./GameLogic/RevorbaroGameLogic');
const port = process.env.PORT || 5000;

const gameServer = new Server({
    roomFactory: (client, data) => gameRoomFactory(GAME_TYPES.TWO_PLAYERS_TURN_BASED, new RevorbaroGameLogic(), client)
});

const server = strummuluServerFactory(gameServer);


server.listen(port);
console.log('game server listening on ', port);