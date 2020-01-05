const Room = require('./Room');

const revorbaro = require('./logic/revorbaro')

class TwoPlayersTurnRoom extends Room {
    init(params) {
        const { creatorId } = params;
        this.gameState = revorbaro.startingGameState(creatorId);
        this.broadcastStateUpdate();
    }

    onJoin(params) {
        const { joinerId } = params;
        this.gameState = revorbaro.player2Joined(joinerId, this.gameState);
        this.broadcastStateUpdate();
    }

    onAction(client, type, payload) {
        const { id: playerId } = client;
        const { turn } = this.gameState;
        if (turn !== playerId) {
            console.log(`[room]: ${playerId} tried action: ${type} but wasnt their turn, was ${turn} turn`);
            return;
        }
        this.gameState.actions[playerId] = type;
        this.broadcast(`${client.id}: ${type}`);
        this.passTurn(playerId);
    }

    passTurn(passingId) {
        const { player1, player2, actions } = this.gameState;
        const newTurn = player1 === passingId ? player2 : player1;
        this.gameState.turn = newTurn;
        if (Object.keys(actions).length < 2) {
            this.broadcastStateUpdate();
            return;
        }

        this.gameState = revorbaro.resolve(passingId, this.gameState)
        this.broadcastStateUpdate();
    }
}


module.exports = TwoPlayersTurnRoom;