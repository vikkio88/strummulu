import React, { Component } from 'react';

class Lobby extends Component {
    state = {
        roomId: ''
    };

    render() {
        const { onCreate, onJoin } = this.props;
        const { roomId } = this.state;
        return (
            <>
                <button onClick={onCreate}>Create</button>
                <div>
                    <input type="text" value={roomId} placeholder="Room Id" onChange={({ target }) => this.setState({ roomId: target.value })} />
                    <button onClick={() => onJoin(roomId)}>Join</button>
                </div>
            </>
        );
    }
}

export default Lobby;