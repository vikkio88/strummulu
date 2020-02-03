class GameLogicInterface {
    startingGameState(creatorId, gameState) { }
    player2Joined(joinerId, gameState) { }
    forfeit(leaverId, gameState) { }
    getMutationFromAction(playerId, action, gameState) { }
    passTurn(passingId, gameState) { }
    needsResolving(gameState) { }
    resolve(player, gameState) { }
}

module.exports = GameLogicInterface;