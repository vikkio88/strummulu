const ACTIONS = {
    SHOOT: 'shoot',
    DEFEND: 'defend',
    RELOAD: 'reload',
};

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



module.exports = {
    startingGameState(creatorId, gameState) {
        return {
            ...gameState,
            finished: false,
            waiting: true,
            player1: creatorId,
            turn: null,
            winner: null,
            players: {
                [creatorId]: { loaded: false, winner: false, loser: false }
            },
            actions: {}
        };
    },
    player2Joined(joinerId, gameState) {
        return {
            ...gameState,
            waiting: false,
            player2: joinerId,
            turn: joinerId,
            player2: joinerId,
            players: {
                ...gameState.players,
                [joinerId]: { loaded: false, winner: false, loser: false }
            }
        };

    },
    canPerformAction(playerId, { type }, gameState) {
        const { turn } = gameState;
        const playerState = gameState.players[playerId];
        let error = null;
        let fallbackType = null;

        if (turn !== playerId) {
            error = 'action in wrong turn';
        }
        if (!playerState.loaded && type === ACTIONS.SHOOT) {
            error = 'cannot shoot without reloading, reloading';
            fallbackType = ACTIONS.RELOAD;
        }

        return { error, fallbackType };
    },
    resolve(player, gameState) {
        const other = player === gameState.player1 ? gameState.player2 : gameState.player1;
        const otherState = gameState.players[other];
        const otherAction = gameState.actions[other];

        const selfState = gameState.players[player];
        const selfAction = gameState.actions[player];

        const selfNewState = { ...selfState, ...resolveMatrix[selfAction][otherAction][PLAYERS.SELF] };
        const otherNewState = { ...otherState, ...resolveMatrix[selfAction][otherAction][PLAYERS.OTHER] };

        let finished = false;
        if (selfNewState.winner || selfNewState.loser) {
            finished = true;
        }

        return {
            ...gameState,
            actions: {},
            players: {
                [player]: selfNewState,
                [other]: otherNewState,
            },
            finished
        }
    }
}



