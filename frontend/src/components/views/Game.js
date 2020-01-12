import React, { Component } from 'react';

class Game extends Component {
    winnerLoser(finishedAndWinner) {
        if (finishedAndWinner) {
            return 'YOU WON';
        }

        return 'YOU LOST';
    }

    render() {
        const { gameState, roomId, playerId, onAction, onLeave } = this.props;
        const { waiting } = (gameState || {});
        const { finished } = (gameState || {});
        const finishedAndWinner = finished && gameState.players[playerId].winner;
        const restartRequested = finished && gameState.players[playerId].restartRequest;

        const myTurn = playerId && (playerId === (gameState && gameState.turn));

        return (
            <div className="actions">
                {finished && (
                    <>
                        <h1>{this.winnerLoser(finishedAndWinner)}</h1>
                        {!restartRequested && (
                            <>
                                <h2>Wanna do another game?</h2>
                                <button onClick={() => onAction('restart')}>YES</button>
                                <button onClick={() => { onLeave(roomId) }}>NO</button>
                            </>)}
                        {restartRequested && (
                            <>
                                <h2>Waiting for the other player to accept</h2>
                                <button onClick={() => onLeave(roomId)}>Leave Room</button>
                            </>
                        )}
                    </>
                )}
                {!finished && (
                    <div>
                        <h3>Room: {roomId}</h3>
                        {waiting && <h2>Waiting for Player 2</h2>}
                        {!waiting && <h2>{`${myTurn ? 'Your' : 'Enemy'} turn`}</h2>}
                        <button disabled={!myTurn} onClick={() => onAction('shoot')}>Shoot</button>
                        <button disabled={!myTurn} onClick={() => onAction('defend')}>Defend</button>
                        <button disabled={!myTurn} onClick={() => onAction('reload')}>Reload</button>
                    </div>
                )}

            </div>
        );
    }
}

export default Game;