import React, { Component } from 'react';
import './App.css';

import io from './libs/game/io';
import messageHandler from './libs/game/messageHandler';

class App extends Component {
  state = {
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

  render() {
    const { messages, gameState, roomId, joinedRoomId } = this.state;
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

          {joinedRoomId && (
            <div>
              <h3>{joinedRoomId}</h3>
              <button onClick={() => this.action(1)}>Action 1</button>
              <button onClick={() => this.action(2)}>Action 2</button>
            </div>
          )}

        </div>

        <div className="info">
          <h2>Messages</h2>
          <div>
            {messages.map((m, index) => <div key={index}>{JSON.stringify(m)}</div>)}
          </div>

          <h2>Game State</h2>
          <div>
            <pre>
              {JSON.stringify(gameState)}
            </pre>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
