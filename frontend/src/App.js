import React, { Component } from 'react';
import './App.css';

import io from 'libs/game/io';
import messageHandler from 'libs/game/messageHandler';
//import { GameState } from 'components/game';
import { Lobby, Game } from 'components/views';

class App extends Component {
  state = {
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

  join = roomId => {
    io.joinRoom(roomId);
  }

  leave = roomId => {
    io.leaveRoom(roomId);
    this.setState({
      joinedRoomId: null,
      messages: [],
      gameState: {}
    })
  }

  action = type => {
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

  render() {
    const { gameState, joinedRoomId, me } = this.state;
    return (
      <div className="App">
        <h1>Revorbaro-Multiplayer</h1>
        {!joinedRoomId && <Lobby onJoin={this.join} onCreate={this.create} />}
        {joinedRoomId && (
          <Game
            gameState={gameState}
            playerId={me}
            roomId={joinedRoomId}
            onAction={this.action}
            onLeave={this.leave}
          />
        )}

        {/*<GameState gameState={gameState} onAction={this.action} />*/}

      </div>
    );
  }
}

export default App;
