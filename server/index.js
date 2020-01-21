const socketIo = require('socket.io');
const { EVENTS, CLIENT_ACTIONS } = require('./const');
const Server = require('./game/Server');
const { GAME_TYPES, gameRoomFactory } = require('./game/GameRoomFactory');


const strummuluServerFactory = (server, io = socketIo()) => {
    io.on(EVENTS.CONNECTION, c => {
        server.connected(c.id, c);

        c.once(EVENTS.DISCONNECTION, () => {
            server.disconnected(c.id)
        });

        c.on(CLIENT_ACTIONS.CREATE_ROOM, data => {
            server.createRoom(c, data);
        });

        c.on(CLIENT_ACTIONS.JOIN_ROOM, data => {
            const { roomId } = data;
            server.joinRoom(roomId, c);
        });

        c.on(CLIENT_ACTIONS.LEAVE_ROOM, data => {
            const { roomId } = data;
            server.leaveRoom(roomId, c);
        });


        c.on(CLIENT_ACTIONS.ACTION, data => {
            const { type, roomId, payload } = data;
            server.clientAction(c, type, roomId, payload);
        });

    });

    return io;
}


module.exports = { GAME_TYPES, CLIENT_ACTIONS, EVENTS, strummuluServerFactory, Server, gameRoomFactory, socketIo };
