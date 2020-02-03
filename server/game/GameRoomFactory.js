const TwoPlayersTurnRoom = require('../Room/TwoPlayersTurnRoom');
const GAME_TYPES = {
    TWO_PLAYERS_TURN_BASED: 'twoPlayersTurnBased'
};

const GAME_TYPES_ROOMS = {
    [GAME_TYPES.TWO_PLAYERS_TURN_BASED]: TwoPlayersTurnRoom
};

const gameRoomFactory = (type, gameLogic, creator, config = {}) => {
    if (!GAME_TYPES_ROOMS[type]) {
        throw Error(`${type} is not a valid game type`);
    }

    return new (GAME_TYPES_ROOMS[type])(creator, gameLogic, config);
}

module.exports = {
    gameRoomFactory,
    GAME_TYPES
}