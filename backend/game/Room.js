const { MESSAGES, MESSAGE_TYPES } = require('../const');
const generateId = () => Math.random().toString(36).substr(2, 5);

class Room {

    constructor(creator, maxPlayers = 2) {
        this.id = generateId()

        this.maxPlayers = maxPlayers;
        this.players = new Map();
        const { id: creatorId } = creator;
        this.players.set(creatorId, creator);

        this.init({ creatorId });

        creator.emit(MESSAGES.MESSAGE, { type: MESSAGE_TYPES.CREATED_ROOM, roomId: this.id, creatorId: creatorId });
    }

    init(params) {
        this.gameState = {}
        this.broadcastStateUpdate();
    }

    onJoin() {

    }

    onAction() {

    }

    has(client) {
        return this.players.has(client.id);
    }

    join(client) {
        const { id: joinerId } = client;
        if (this.players.size === this.maxPlayers || this.players.has(joinerId)) {
            return false;
        }

        this.players.set(joinerId, client);
        this.onJoin({ joinerId });

        return true;
    }

    leave(clientId) {
        this.players.delete(clientId);
        console.log(`[room]: ${clientId} left room ${this.id}`);
        this.broadcast({ type: MESSAGE_TYPES.LEFT_ROOM, leaverId: clientId });
    }

    tryJoin(client) {
        const joined = this.join(client);
        const roomId = this.id;
        const joinerId = client.id;
        console.log(`[room]: ${joinerId} trying joining ${roomId}`);

        if (!joined) {
            console.log(`[room]: ${joinerId} couldnt join room ${roomId}`)
            client.emit(MESSAGES.ERROR, `Cannot join room ${roomId}`);
            return false;
        }

        this.broadcast({ type: MESSAGE_TYPES.JOINED_ROOM, joinerId, roomId });
        return true;
    }

    playerAction(client, type, payload) {
        this.onAction(client, type, payload);
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