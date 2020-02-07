const MESSAGE_TYPES = {
    CREATED_ROOM: 'createdRoom',
    JOINED_ROOM: 'joinedRoom',
    default: 'text'
};

const defaultHandler = (message, currentState) => {
    let { messages } = currentState;
    messages = [...messages, message];

    return { messages };
};

const createdRoom = (message, currentState) => {
    const { roomId, creatorId } = message;
    return { joinedRoomId: roomId, me: creatorId };
};

const joinedRoom = (message, currentState) => {
    const { roomId, joinerId } = message;
    const newState = { joinedRoomId: roomId };
    if (!currentState.me) {
        newState.me = joinerId;
    }
    return newState;
};

const MESSAGE_HANDLERS = {
    [MESSAGE_TYPES.CREATED_ROOM]: createdRoom,
    [MESSAGE_TYPES.JOINED_ROOM]: joinedRoom,
    [MESSAGE_TYPES.default]: defaultHandler
};

const log = (type, message) => {
    console.log(`[MESSAGE_HANDLER]: message of type ${type} received`);
    console.log(`[MESSAGE_HANDLER]: content:`, message);
}


export default (types = MESSAGE_TYPES, messageHandlers = MESSAGE_HANDLERS) => {
    if (!types.default || !messageHandlers[types.default]) throw Error('No default set for message or handlers');
    return (message, currentState = {}, verbose = false) => {
        let { type } = message;
        type = Object.values(types).indexOf(type) > -1 ? type : types.default;
        if (verbose) log(type, message);

        const handler = messageHandlers[type || types.default];
        return handler(message, currentState);
    }
};
