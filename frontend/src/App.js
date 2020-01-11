import React, { Component } from 'react';
import './App.css';

import io from './libs/game/io';
import messageHandler from './libs/game/messageHandler';

class App extends Component {
  state = {
    me: null,
    roomId: '',
    joinedRoomId: null,
    messages: [],
    gameState: {}
  }

  messageHandler(msg) {
    const newState = messageHandler(msg, this.state)
    this.setState({ ...newState });
  }

  gameStateUpdate(gameState) {
    this.setState({ gameState });
  }

  create = () => {
    io.createRoom();
  }

  join = () => {
    const { roomId } = this.state;
    io.joinRoom(roomId);
  }

  action(type) {
    const { joinedRoomId } = this.state;
    io.sendAction(type, joinedRoomId);
  }

  componentDidMount() {
    io.init({
      [io.EVENTS.MESSAGE]: msg => this.messageHandler(msg),
      [io.EVENTS.ERROR]: msg => this.messageHandler(msg),
      [io.EVENTS.STATE_UPDATE]: data => this.gameStateUpdate(data)
    })
  }

  winnerLoser(finishedAndWinner) {
    if (finishedAndWinner) {
      return 'YOU WON';
    }

    return 'YOU LOST';
  }

  render() {
    const { gameState, roomId, joinedRoomId, me } = this.state;
    const { waiting } = (gameState || {});
    const { finished } = (gameState || {});
    const finishedAndWinner = finished && gameState.players[me].winner;
    const restartRequested = finished && gameState.players[me].restartRequest;

    const myTurn = me && (me === (gameState && gameState.turn));
    return (
      <div className="App">

        <div className="actions">
          {!joinedRoomId && <button onClick={this.create}>Create</button>}
          {!joinedRoomId && (
            <div>
              <input type="text" value={roomId} placeholder="Room Id" onChange={({ target }) => this.setState({ roomId: target.value })} />
              <button onClick={this.join}>Join</button>
            </div>
          )}
          {finished && (
            <>
              <h1>{this.winnerLoser(finishedAndWinner)}</h1>
              {!restartRequested && (
                <>
                  <h2>Wanna do another game?</h2>
                  <button onClick={() => this.action('restart')}>YES</button>
                  <button onClick={() => { window.location.reload() }}>NO</button>
                </>)}
              {restartRequested && <h2>Waiting for the other player to accept</h2>}
            </>
          )}
          {!finished && joinedRoomId && (
            <div>
              <h3>me: {me}</h3>
              <h3>Room: {joinedRoomId}</h3>
              {waiting && <h2>Waiting for Player 2</h2>}
              {!waiting && <h2>{`${myTurn ? 'Your' : 'Enemy'} turn`}</h2>}
              <button disabled={!myTurn} onClick={() => this.action('shoot')}>Shoot</button>
              <button disabled={!myTurn} onClick={() => this.action('defend')}>Defend</button>
              <button disabled={!myTurn} onClick={() => this.action('reload')}>Reload</button>
            </div>
          )}

        </div>

        <div className="info">
          <h2>Game State</h2>
          <div>
            <pre>
              {JSON.stringify(gameState, null, 2)}
            </pre>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
