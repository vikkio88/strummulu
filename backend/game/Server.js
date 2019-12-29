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


    createRoom(connection) {
        const room = new Room()
        this.rooms.set(room.id, room);
        const roomId = room.id;
        connection.emit(MESSAGES.MESSAGE, { roomId });
        console.log(`[SERVER]: ${connection.id} created room ${roomId}`);
    }

    joinRoom(roomId, clientId) {
        console.log(`[SERVER]: ${clientId} entering room ${roomId}`);
        const room = this.rooms.get(roomId);

        if (!room) {
            console.log(`[SERVER]: ${clientId} could not enter room ${roomId}`);
            return false;
        }

        const joined = room.join(clientId);

        if (joined) {
            console.log(`[SERVER]: ${clientId} entered room ${roomId}`);
            for (const clientId of room.connections) {
                const connection = this.connections.get(clientId);
                connection && connection.emit(MESSAGES.MESSAGE, { roomId, type: 'Joined', clientId })
            }
        }
    }
}


module.exports = Server;