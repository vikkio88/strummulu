const { MESSAGES, MESSAGE_TYPES } = require('../const');
const generateId = () => Math.random().toString(36).substr(2, 5);

class Room {
    /** Might be better to move  ↓ gameLogic to config      ↓  */
    constructor(creator, gameLogic = null, { maxPlayers = 2, idGenerator = generateId, verbose = true }) {
        this.id = idGenerator();
        this.verbose = verbose;

        this.gameLogic = gameLogic;
        this.maxPlayers = maxPlayers;
        this.players = new Map();
        const { id: creatorId } = creator;
        this.players.set(creatorId, creator);
        creator.emit(MESSAGES.MESSAGE, { type: MESSAGE_TYPES.CREATED_ROOM, roomId: this.id, creatorId: creatorId });
        this.init({ creatorId });
    }

    init(params) {
        this.gameState = {}
        this.broadcastStateUpdate();
    }

    onJoin(params) {

    }

    onAction(params) {

    }

    onLeave(params) {

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
        this.log(`${clientId} left the room`);
        this.onLeave({ leaverId: clientId });
        this.broadcast({ type: MESSAGE_TYPES.LEFT_ROOM, leaverId: clientId });
    }

    tryJoin(client) {
        const joined = this.join(client);
        const roomId = this.id;
        const joinerId = client.id;
        this.log(`${joinerId} trying joining`);

        if (!joined) {
            this.log(`${joinerId} couldn't join room`)
            client.emit(MESSAGES.ERROR, `Cannot join room ${roomId}`);
            return false;
        }

        this.broadcast({ type: MESSAGE_TYPES.JOINED_ROOM, joinerId, roomId });
        return true;
    }

    playerAction(client, type, payload) {
        this.onAction({ client, type, payload });
    }

    broadcast(payload, messageType = MESSAGES.MESSAGE) {
        this.players.forEach((c, id) => {
            c.emit(messageType, payload)
        });
    }

    broadcastStateUpdate() {
        this.broadcast(this.gameState, MESSAGES.STATE_UPDATE);
    }

    log(message) {
        if (!this.verbose) return;
        console.log(`[room: ${this.id}]: ${message}`);
    }
}

module.exports = Room;