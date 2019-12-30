const MESSAGES = {
    MESSAGE: 'message',
    ERROR: 'errorMessage',
    STATE_UPDATE: 'stateUpdate'
};

const EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect'
}

const CLIENT_ACTIONS = {
    CREATE_ROOM: 'createRoom',
    JOIN_ROOM: 'joinRoom',
    LEAVE_ROOM: 'leaveRoom',
};



module.exports = {
    MESSAGES,
    EVENTS,
    CLIENT_ACTIONS
};