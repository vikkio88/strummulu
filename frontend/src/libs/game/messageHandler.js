const MESSAGE_TYPES = {
    CREATED_ROOM: 'createdRoom',
    JOINED_ROOM: 'joinedRoom',
    default: 'TEXT'
};

const defaultHandler = (message, currentState) => {
    let { messages } = currentState;
    messages = [...messages, message];

    return { messages };
};

const joinedRoom = (message, currentState) => {
    console.log(message);
    const { roomId } = message;
    return { joinedRoomId: roomId };
}

const MESSAGE_HANDLERS = {
    [MESSAGE_TYPES.CREATED_ROOM]: joinedRoom,
    [MESSAGE_TYPES.JOINED_ROOM]: joinedRoom,
    [MESSAGE_TYPES.default]: defaultHandler
};


export default (message, currentState) => {
    let { type } = message;
    console.log('message: ', message);
    type = Object.values(MESSAGE_TYPES).indexOf(type) > -1 ? type : MESSAGE_TYPES.default;
    console.log(`type ${type}`);
    const handler = MESSAGE_HANDLERS[type || MESSAGE_TYPES.default];
    return handler(message, currentState);
}