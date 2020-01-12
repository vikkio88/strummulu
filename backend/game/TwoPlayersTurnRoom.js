const Room = require('./Room');

const revorbaro = require('./logic/revorbaro')

class TwoPlayersTurnRoom extends Room {
    init(params) {
        const { creatorId } = params;
        this.gameState = revorbaro.startingGameState(creatorId);
        this.broadcastStateUpdate();
    }

    onLeave(params) {
        const { leaverId } = params;
        this.gameState = revorbaro.forfait(leaverId, this.gameState);
        this.broadcastStateUpdate();
    }

    onJoin(params) {
        const { joinerId } = params;
        this.gameState = revorbaro.player2Joined(joinerId, this.gameState);
        this.broadcastStateUpdate();
    }

    onAction({ client, type, payload }) {
        const { id: playerId } = client;
        const { error, action, mutation } = revorbaro.getMutationFromAction(playerId, { type }, this.gameState);
        if (error) {
            console.log(`[room]: ${playerId} tried action ${type}, but the check produced an error: ${error}`);
            if (!action) return;
        }

        this.gameState = mutation(playerId, action, this.gameState);
        this.broadcast(`${client.id}: action chosen`);
        this.passTurn(playerId);
    }

    passTurn(passingId) {
        this.gameState = revorbaro.passTurn(passingId, this.gameState);
        if (!revorbaro.needsResolving(this.gameState)) {
            this.broadcastStateUpdate();
            return;
        }

        this.gameState = revorbaro.resolve(passingId, this.gameState)
        this.broadcastStateUpdate();
    }
}


module.exports = TwoPlayersTurnRoom;