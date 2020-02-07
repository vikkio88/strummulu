import React, { Component } from 'react';
import './App.css';

import { preloadAssets } from 'libs';
import strummulu from 'strummulu-client';
//import { GameState } from 'components/game';
import { Lobby, Game } from 'components/views';

const { clientFactory, messageHandlerFactory } = strummulu;

const { REACT_APP_GAME_BACKEND_URL } = process.env;
const client = clientFactory(REACT_APP_GAME_BACKEND_URL);
const messageHandler = messageHandlerFactory();


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
    client.createRoom();
  }

  join = roomId => {
    client.joinRoom(roomId);
  }

  leave = roomId => {
    client.leaveRoom(roomId);
    this.setState({
      joinedRoomId: null,
      messages: [],
      gameState: {}
    })
  }

  action = type => {
    const { joinedRoomId } = this.state;
    client.sendAction(type, joinedRoomId);
  }

  componentDidMount() {
    client.init({
      [client.EVENTS.MESSAGE]: msg => this.messageHandler(msg),
      [client.EVENTS.ERROR]: msg => this.messageHandler(msg),
      [client.EVENTS.STATE_UPDATE]: data => this.gameStateUpdate(data)
    });

    preloadAssets();
  }

  render() {
    const { gameState, joinedRoomId, me } = this.state;
    return (
      <div className="App">
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
