const { MESSAGES } = require('../const');

class Server {
    constructor(config) {
        const { roomFactory, verbose = true } = config;
        if (!roomFactory) throw Error('Empty roomFactory');

        this.verbose = verbose;
        this.roomFactory = roomFactory;
        this.rooms = new Map();
        this.connections = new Map();
        this.connectionRooms = new Map();
    }

    connected(clientId, connection) {
        this.connections.set(clientId, connection);
        this.log(`${clientId} connected`);
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
        this.log(`${clientId} disconnected`);
    }

    createRoom(client, data) {
        const room = this.roomFactory(client, data);
        this.rooms.set(room.id, room);
        const roomId = room.id;
        this.connectionRooms.set(client.id, roomId);
        this.log(`${client.id} created/joined room ${roomId}`);
    }

    joinRoom(roomId, client) {
        const { id: clientId } = client;
        this.log(`${clientId} entering room ${roomId}`);
        const room = this.rooms.get(roomId);

        if (!room) {
            this.log(`${clientId} try entering non existing room ${roomId}`);
            client.emit(MESSAGES.ERROR, `Room ${roomId} does not exist`);
            return false;
        }

        const joined = room.tryJoin(client);
        if (joined) {
            this.log(`${clientId} joined ${roomId}`);
            this.connectionRooms.set(clientId, roomId);
            return true;
        }

        return false;
    }

    leaveRoom(roomId, client) {
        const { id: clientId } = client;
        const room = this.rooms.get(roomId);

        if (!room) {
            client.emit(MESSAGES.ERROR, `Non existing room ${roomId}`);
            this.log(`${clientId} tried to leave a non existing room ${roomId}`);
            return false;
        }

        if (!room.has(client)) {
            client.emit(MESSAGES.ERROR, `Action not allowed in room ${roomId}`);
            this.log(`${clientId} tried to leave room ${roomId} but it wasn't in`);
            return false;
        }

        room.leave(clientId);
        this.roomCleanup(room);
        return true;
    }

    clientAction(client, type, roomId, payload) {
        const { id: clientId } = client;
        const room = this.rooms.get(roomId);

        if (!room) {
            client.emit(MESSAGES.ERROR, `Non existing room ${roomId}`);
            this.log(`${clientId} tried performing action ${type} in non existing room ${roomId}`);
            return false;
        }

        if (!room.has(client)) {
            client.emit(MESSAGES.ERROR, `Action not allowed in room ${roomId}`);
            this.log(`${clientId} tried performing action ${type} in room ${roomId}`);
            return false;
        }

        room.playerAction(client, type, payload);
        return true;
    }

    roomCleanup(room) {
        const roomId = room.id;
        if (room.players.size < 1) {
            this.log(`everyone left the room ${roomId}, destroying it`);
            this.rooms.delete(roomId);
        }
    }

    log(message) {
        if (!this.verbose) return;
        console.log(`[SERVER]: ${message}`);
    }
}


module.exports = Server;