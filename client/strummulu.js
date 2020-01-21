import openSocket from 'socket.io-client';

const logger = msg => console.log(msg);
const CLIENT_EVENTS = {
    CREATE_ROOM: 'createRoom',
    JOIN_ROOM: 'joinRoom',
    LEAVE_ROOM: 'leaveRoom',
    ACTION: 'action'
};

const SERVER_EVENTS = {
    MESSAGE: 'message',
    ERROR: 'errorMessage',
    STATE_UPDATE: 'stateUpdate'
};

const defaultConfig = {
    [SERVER_EVENTS.MESSAGE]: logger,
    [SERVER_EVENTS.ERROR]: logger,
};

const strummulu = serverUrl => {
    return {
        EVENTS: SERVER_EVENTS,

        init(config = {}) {
            this.socket = openSocket(serverUrl);
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
        leaveRoom(roomId) {
            this.socket.emit(CLIENT_EVENTS.LEAVE_ROOM, { roomId });
        },
        sendAction(type, roomId, payload = {}) {
            this.socket.emit(CLIENT_EVENTS.ACTION, { type, roomId, payload })
        }

    }
};


export default strummulu;