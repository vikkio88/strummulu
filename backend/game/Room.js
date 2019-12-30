const { MESSAGES } = require('../const');
const generateId = () => Math.random().toString(36).substr(2, 5);

class Room {

    constructor(creator, maxPlayers = 2) {
        this.id = generateId()

        this.maxPlayers = maxPlayers;
        this.players = new Map();
        const { id: creatorId } = creator;
        this.players.set(creatorId, creator);

        this.init();
    }

    init() {
        this.gameState = {};
    }

    join(client) {
        const { id: joinerId } = client;
        if (this.players.size === this.maxPlayers || this.players.has(joinerId)) {
            return false;
        }

        this.players.set(joinerId, client);

        return true;
    }

    tryJoin(client) {
        const joined = this.join(client);
        const roomId = this.id;
        const joinerId = client.id;
        console.log(`[room]: ${joinerId} trying joining ${roomId}`)

        if (!joined) {
            console.log(`[room]: ${joinerId} couldnt join room ${roomId}`)
            client.emit(MESSAGES.ERROR, `Cannot join room ${roomId}`);
            return;
        }

        this.broadcast({ joinerId, roomId });
    }

    broadcast(payload, messageType = MESSAGES.MESSAGE) {
        this.players.forEach((c, id) => {
            c.emit(messageType, payload)
        });
    }

    broadcastStateUpdate() {
        this.broadcast(this.gameState, MESSAGES.STATE_UPDATE);
    }

}

module.exports = Room;