const port = process.env.PORT || 3000;
const express = require('express');
const { Server, strummuluServerFactory, socketIo } = require('strummulu-server');
const Room = require('strummulu-server/Room/Room');

const config = {
    maxPlayers: 10,
    verbose: true
};

const getTimeString = () => {
    const date = new Date();
    return date.toLocaleTimeString();
}
class ChatRoom extends Room {
    constructor(creator) {
        super(creator, null, config);
    }

    init() {
        this.gameState = { messages: [] };
        this.broadcastStateUpdate();
    }

    onAction({ client, type, payload }) {
        if (type === 'message') {
            this.gameState.messages.push(`${getTimeString()} - ${client.id}: ${payload.message}`);
            this.broadcastStateUpdate();
        }
    }

    onJoin({ joinerId }) {
        this.gameState.messages.push(`${getTimeString()} - SERVER: ${joinerId} joined the chat`);
        this.broadcastStateUpdate();
    }

    onLeave({ leaverId }) {
        this.gameState.messages.push(`${getTimeString()} - SERVER: ${leaverId} left the chat`);
        this.broadcastStateUpdate();
    }
}

const gameServer = new Server({
    roomFactory: client => new ChatRoom(client)
});

const expressServer = express()
    .use(express.static('public'))
    .listen(port, () => console.log(`Listening on ${port}`));

strummuluServerFactory(gameServer, socketIo(expressServer));
