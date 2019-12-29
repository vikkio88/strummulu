import React, { Component } from 'react';
import './App.css';

import io from './libs/game/io';

class App extends Component {
  state = {
    roomId: null,
    messages: [],
    gameState: {}
  }

  addMessage(msg) {
    const { messages } = this.state;
    this.setState({ messages: [...messages, msg] });
  }

  stateUpdate(gameState) {
    this.setState({ gameState });
  }

  create = () => {
    io.createRoom();
  }

  join = () => {
    const { roomId } = this.state;
    io.joinRoom(roomId);
  }

  componentDidMount() {
    io.init({
      [io.EVENTS.MESSAGE]: msg => this.addMessage(msg),
      [io.EVENTS.STATE_UPDATE]: data => this.stateUpdate(data)
    })
  }

  render() {
    const { messages, roomId } = this.state;
    return (
      <div className="App">
        <div>
          {messages.map((m, index) => <div key={index}>{JSON.stringify(m)}</div>)}
        </div>
        <button onClick={this.create}>Create</button>
        <input type="text" value={roomId} placeholder="Room Id" onInput={({ target }) => this.setState({ roomId: target.value })} />
        <button onClick={this.join}>Join</button>
      </div>
    );
  }
}

export default App;
