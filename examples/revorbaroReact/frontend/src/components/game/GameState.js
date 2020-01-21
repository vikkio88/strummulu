import React, { Component } from 'react';

class GameState extends Component {
    render() {
        const { gameState } = this.props;
        return (
            <div className="info">
                <h2>Game State</h2>
                <div>
                    <pre>
                        {JSON.stringify(gameState, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }
}

export default GameState;