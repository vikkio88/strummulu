import React, { Component } from 'react';
import { Button, Input } from 'components/common';

class Lobby extends Component {
    state = {
        roomId: ''
    };

    render() {
        const { onCreate, onJoin } = this.props;
        const { roomId } = this.state;
        return (
            <div className="view">
                <h2>Game Lobby</h2>
                <Button onClick={onCreate}>Create Room</Button>
                <div>
                    <Button disabled={roomId.length < 3} onClick={() => onJoin(roomId)}>Join Room</Button>
                    <Input type="text" value={roomId} placeholder="Room Id" onChange={({ target }) => this.setState({ roomId: target.value })} />
                </div>
            </div>
        );
    }
}

export default Lobby;