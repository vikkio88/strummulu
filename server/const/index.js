const MESSAGES = {
    MESSAGE: 'message',
    ERROR: 'errorMessage',
    STATE_UPDATE: 'stateUpdate'
};

const MESSAGE_TYPES = {
    CREATED_ROOM: 'createdRoom',
    JOINED_ROOM: 'joinedRoom',
    LEFT_ROOM: 'leftRoom',
    default: 'TEXT'
};

const EVENTS = {
    CONNECTION: 'connection',
    DISCONNECTION: 'disconnect'
};

const CLIENT_ACTIONS = {
    CREATE_ROOM: 'createRoom',
    JOIN_ROOM: 'joinRoom',
    LEAVE_ROOM: 'leaveRoom',
    ACTION: 'action'
};



module.exports = {
    MESSAGES,
    MESSAGE_TYPES,
    EVENTS,
    CLIENT_ACTIONS
};