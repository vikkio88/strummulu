const { MESSAGES } = require('../const');
const Room = require('./Room');

class Server {
    constructor() {
        this.rooms = new Map();
        this.connections = new Map();
    }

    connected(clientId, connection) {
        this.connections.set(clientId, connection);
        console.log(`[SERVER]: ${clientId} connected`);
    }

    disconnected(clientId) {
        this.connections.delete(clientId);
        console.log(`[SERVER]: ${clientId} disconnected`);
    }


    createRoom(client) {
        const room = new Room(client)
        this.rooms.set(room.id, room);
        const roomId = room.id;
        client.emit(MESSAGES.MESSAGE, { roomId });
        console.log(`[SERVER]: ${client.id} created room ${roomId}`);
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

        room.tryJoin(client);
    }
}


module.exports = Server;