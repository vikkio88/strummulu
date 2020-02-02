const { MESSAGES } = require('../const');

class Server {
    constructor(config) {
        const { roomFactory } = config;
        if (!roomFactory) throw Error('Empty roomFactory');
        this.roomFactory = roomFactory;
        this.rooms = new Map();
        this.connections = new Map();
        this.connectionRooms = new Map();
    }

    connected(clientId, connection) {
        this.connections.set(clientId, connection);
        console.log(`[SERVER]: ${clientId} connected`);
    }

    disconnected(clientId) {
        this.connections.delete(clientId);
        if (this.connectionRooms.has(clientId)) {
            const roomId = this.connectionRooms.get(clientId);
            const room = this.rooms.get(roomId);
            if (!room) return;
            room.leave(clientId);
            this.roomCleanup(room);
        }
        console.log(`[SERVER]: ${clientId} disconnected`);
    }

    createRoom(client, data) {
        const room = this.roomFactory(client, data);
        this.rooms.set(room.id, room);
        const roomId = room.id;
        this.connectionRooms.set(client.id, roomId);
        console.log(`[SERVER]: ${client.id} created/joined room ${roomId}`);
    }

    joinRoom(roomId, client) {
        const { id: clientId } = client;
        console.log(`[SERVER]: ${clientId} entering room ${roomId}`);
        const room = this.rooms.get(roomId);

        if (!room) {
            console.log(`[SERVER]: ${clientId} try entering non existing room ${roomId}`);
            client.emit(MESSAGES.ERROR, `Room ${roomId} does not exist`);
            return false;
        }

        const joined = room.tryJoin(client);
        if (joined) {
            console.log(`[SERVER]: ${clientId} joined ${roomId}`);
            this.connectionRooms.set(clientId, roomId);
        }
    }

    leaveRoom(roomId, client) {
        const { id: clientId } = client;
        const room = this.rooms.get(roomId);

        if (!room) {
            client.emit(MESSAGES.ERROR, `Non exisitng room ${roomId}`);
            console.log(`[SERVER]: ${clientId} tried to leave a non existing room ${roomId}`);
            return;
        }

        if (!room.has(client)) {
            client.emit(MESSAGES.ERROR, `Action not allowed in room ${roomId}`);
            console.log(`[SERVER]: ${clientId} tried to leave room ${roomId} but it wasnt in`);
            return;
        }

        room.leave(clientId);
        this.roomCleanup(room);
    }

    clientAction(client, type, roomId, payload) {
        const { id: clientId } = client;
        const room = this.rooms.get(roomId);

        if (!room) {
            client.emit(MESSAGES.ERROR, `Non exisitng room ${roomId}`);
            console.log(`[SERVER]: ${clientId} tried performing action ${type} in non existing room ${roomId}`);
            return;
        }

        if (!room.has(client)) {
            client.emit(MESSAGES.ERROR, `Action not allowed in room ${roomId}`);
            console.log(`[SERVER]: ${clientId} tried performing action ${type} in room ${roomId}`);
            return;
        }

        room.playerAction(client, type, payload);
    }

    roomCleanup(room) {
        const roomId = room.id;
        if (room.players.size < 1) {
            console.log(`[SERVER]: everyone left the room ${roomId}, destroying it`);
            this.rooms.delete(roomId);
        }
    }
}


module.exports = Server;