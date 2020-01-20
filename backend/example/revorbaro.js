const GameLogicInterface = require('../game/logic/GameLogicInterface');
const ACTIONS = {
    SHOOT: 'shoot',
    DEFEND: 'defend',
    RELOAD: 'reload',
    RESTART: 'restart'
};

const GAME_ACTIONS = [ACTIONS.SHOOT, ACTIONS.RELOAD, ACTIONS.DEFEND];

const PLAYERS = {
    SELF: 'self',
    OTHER: 'other',
}
const resolveMatrix = {
    [ACTIONS.SHOOT]: {
        [ACTIONS.SHOOT]: { [PLAYERS.SELF]: { loaded: false }, [PLAYERS.OTHER]: { loaded: false } },
        [ACTIONS.DEFEND]: { [PLAYERS.SELF]: { loaded: false }, [PLAYERS.OTHER]: {} },
        [ACTIONS.RELOAD]: { [PLAYERS.SELF]: { loaded: false, winner: true }, [PLAYERS.OTHER]: { loaded: true, loser: true } }
    },
    [ACTIONS.DEFEND]: {
        [ACTIONS.SHOOT]: { [PLAYERS.SELF]: {}, [PLAYERS.OTHER]: { loaded: false } },
        [ACTIONS.DEFEND]: { [PLAYERS.SELF]: {}, [PLAYERS.OTHER]: {} },
        [ACTIONS.RELOAD]: { [PLAYERS.SELF]: {}, [PLAYERS.OTHER]: { loaded: true } }
    },
    [ACTIONS.RELOAD]: {
        [ACTIONS.SHOOT]: { [PLAYERS.SELF]: { loaded: true, loser: true }, [PLAYERS.OTHER]: { loaded: false, winner: true } },
        [ACTIONS.DEFEND]: { [PLAYERS.SELF]: { loaded: true, }, [PLAYERS.OTHER]: {} },
        [ACTIONS.RELOAD]: { [PLAYERS.SELF]: { loaded: true }, [PLAYERS.OTHER]: { loaded: true } }
    },
};

const getOtherPlayer = (player, gameState) => {
    return player === gameState.player1 ? gameState.player2 : gameState.player1;
};

const BASE_PLAYER_STATE = { loaded: false, winner: false, loser: false };

const mutations = {
    GAME_ACTION: (playerId, { type }, gameState) => {
        gameState.actions[playerId] = type;
        return gameState;
    },
    RESTART: (playerId, { type }, gameState) => {
        const other = getOtherPlayer(playerId, gameState);
        gameState.players[playerId].restartRequest = true;
        if (gameState.players[other].restartRequest) {
            gameState = {
                ...gameState,
                finished: false,
                waiting: false,
                resolved: null,
                actions: {},
                players: {
                    [playerId]: { ...BASE_PLAYER_STATE },
                    [other]: { ...BASE_PLAYER_STATE }
                }
            };
        }
        return gameState;
    }
};

class RevorbaroGameLogic extends GameLogicInterface {
    startingGameState(creatorId, gameState) {
        return {
            ...gameState,
            finished: false,
            waiting: true,
            player1: creatorId,
            turn: null,
            winner: null,
            actions: {},
            players: {
                [creatorId]: { ...BASE_PLAYER_STATE }
            },
            resolved: null
        };
    }

    player2Joined(joinerId, gameState) {
        return {
            ...gameState,
            waiting: false,
            player2: joinerId,
            turn: joinerId,
            player2: joinerId,
            players: {
                ...gameState.players,
                [joinerId]: { ...BASE_PLAYER_STATE }
            }
        };

    }

    forfait(leaverId, gameState) {
        const winnerId = getOtherPlayer(leaverId, gameState);
        const { history = [] } = gameState;
        history.push(winnerId);
        return {
            ...gameState,
            finished: true,
            players: {
                [winnerId]: { ...gameState.players[winnerId], winner: true, loser: false },
                [leaverId]: { ...gameState.players[winnerId], winner: false, loser: true },
            },
            history
        }
    }

    getMutationFromAction(playerId, { type }, gameState) {
        const { turn } = gameState;
        const playerState = gameState.players[playerId];
        let error = null;
        let fallbackType = null;
        let action = null;
        let mutation = gameState => gameState;

        if (type === ACTIONS.RESTART && !gameState.finished) {
            error = 'tried to restart while game is not finished';
            return { error, action, mutation };
        }

        if (type !== ACTIONS.RESTART && turn !== playerId) {
            error = 'action in wrong turn';
            return { error, action, mutation };
        }

        if (!playerState.loaded && type === ACTIONS.SHOOT) {
            error = 'cannot shoot without reloading, reloading';
            fallbackType = ACTIONS.RELOAD;
        }

        type = fallbackType || type;
        action = { type };
        mutation = GAME_ACTIONS.includes(type) ? mutations.GAME_ACTION : mutations.RESTART;

        return { error, action, mutation };
    }

    passTurn(passingId, gameState) {
        const { player1, player2 } = gameState;
        const newTurn = player1 === passingId ? player2 : player1;
        gameState.turn = newTurn;
        return gameState
    }

    needsResolving({ actions }) {
        return Object.keys(actions).length > 1;
    }

    resolve(player, gameState) {
        const other = player === gameState.player1 ? gameState.player2 : gameState.player1;
        const otherState = gameState.players[other];
        const otherAction = gameState.actions[other];

        const selfState = gameState.players[player];
        const selfAction = gameState.actions[player];

        const selfNewState = { ...selfState, ...resolveMatrix[selfAction][otherAction][PLAYERS.SELF] };
        const otherNewState = { ...otherState, ...resolveMatrix[selfAction][otherAction][PLAYERS.OTHER] };

        let finished = false;
        const { history = [] } = gameState;
        if (selfNewState.winner || selfNewState.loser) {
            history.push(selfNewState.winner ? player : other);
            finished = true;
        }

        return {
            ...gameState,
            actions: {},
            players: {
                [player]: selfNewState,
                [other]: otherNewState,
            },
            history,
            resolved: gameState.actions,
            finished
        }
    }
}

module.exports = RevorbaroGameLogic;



