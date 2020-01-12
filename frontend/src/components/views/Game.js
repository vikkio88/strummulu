import React, { Component } from 'react';
import { Button, Input } from 'components/common';

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
            <div className="view">

                <div className="actions">
                    {finished && (
                        <>
                            <h1>{this.winnerLoser(finishedAndWinner)}</h1>
                            {!restartRequested && (
                                <>
                                    <h2>Do you want to play another game?</h2>
                                    <div>
                                        <Button small onClick={() => onAction('restart')}>Yes</Button>
                                        <Button small onClick={() => { onLeave(roomId) }}>No</Button>
                                    </div>
                                </>)}
                            {restartRequested && (
                                <>
                                    <h2>Waiting for the other player to accept</h2>
                                    <Button onClick={() => onLeave(roomId)}>Leave Room</Button>
                                </>
                            )}
                        </>
                    )}
                    {!finished && (
                        <div>
                            {waiting && <h3>Room: <Input disabled value={roomId} /></h3>}
                            {waiting && <h2>Waiting for Player 2</h2>}
                            {!waiting && <h2>{`${myTurn ? 'Your' : 'Enemy'} turn`}</h2>}
                            <Button disabled={!myTurn} onClick={() => onAction('shoot')}>Shoot</Button>
                            <Button disabled={!myTurn} onClick={() => onAction('defend')}>Defend</Button>
                            <Button disabled={!myTurn} onClick={() => onAction('reload')}>Reload</Button>
                        </div>
                    )}

                </div>
            </div>
        );
    }
}

export default Game;