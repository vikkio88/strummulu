const port = process.env.PORT || 3000;
const express = require('express');
const { Server, strummuluServerFactory, gameRoomFactory, GAME_TYPES, socketIo } = require('strummulu-server');

const gameServer = new Server({
    roomFactory: (client, data) => gameRoomFactory(GAME_TYPES.SIMPLE_ROOM, null, client)
});

const expressServer = express()
    .use(express.static('public'))
    .listen(port, () => console.log(`Listening on ${port}`));

const strummuluServer = strummuluServerFactory(gameServer, socketIo(expressServer));
