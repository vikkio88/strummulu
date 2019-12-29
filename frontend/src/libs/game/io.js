import openSocket from 'socket.io-client';
const logger = msg => console.log(msg);
const CLIENT_EVENTS = {
    CREATE_ROOM: 'createRoom',
    JOIN_ROOM: 'joinRoom',
};

const SERVER_EVENTS = {
    MESSAGE: 'message',
    STATE_UPDATE: 'stateUpdate'
};

const defaultConfig = {
    [SERVER_EVENTS.MESSAGE]: logger
};

const io = {
    EVENTS: SERVER_EVENTS,

    init(config = {}) {
        this.socket = openSocket('http://localhost:5000');
        config = { ...defaultConfig, ...config }
        this.bindEvents(config);
    },

    getId() {
        return this.socket ? this.socket.id : null;
    },

    bindEvents(config) {
        for (const message in SERVER_EVENTS) {
            const event = SERVER_EVENTS[message];
            const handler = config[event] || logger;
            this.socket.on(event, handler);
        }
    },



    createRoom() {
        this.socket.emit(CLIENT_EVENTS.CREATE_ROOM, { me: this.getId() });
    },
    joinRoom(roomId) {
        this.socket.emit(CLIENT_EVENTS.JOIN_ROOM, { roomId });
    },

}


export default io;