const { MESSAGES } = require('../const');
const Room = require('./Room');

class Server {
    constructor() {
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
            room.leave(clientId);
        }
        console.log(`[SERVER]: ${clientId} disconnected`);
    }

    createRoom(client) {
        const room = new Room(client)
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

    clientAction(client, type, roomId, payload) {
        const { id: clientId } = client;
        const room = this.rooms.get(roomId);

        if (!room) {
            client.emit(MESSAGES.ERROR, `Non exisitng room ${roomId}`);
            console.log(`[SERVER]: ${clientId} tried performing action ${type} in non existing room ${roomId}`);
        }

        if (!room.has(client)) {
            client.emit(MESSAGES.ERROR, `Action not allowed in room ${roomId}`);
            console.log(`[SERVER]: ${clientId} tried performing action ${type} in room ${roomId}`);
            return;
        }

        room.playerAction(client, type, payload);
    }
}


module.exports = Server;