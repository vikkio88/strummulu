import React from 'react';
import { Icon } from 'components/common';
import { playSounds } from 'libs';

import './Actions.css';

export default ({ actions, playerId, playSound = false }) => {
    const other = Object.keys(actions).find(id => id !== playerId);
    const myMove = actions[playerId];
    const otherMove = actions[other];
    if (playSound) {
        console.log('playing')
        playSounds([myMove, otherMove]);
    }
    return (
        <div className="actionsWrapper">
            <div className="cell">
                <Icon type={myMove} />
                <span>You</span>
            </div>
            <div className="cell">
                <Icon type={otherMove} />
                <span>Enemy</span>
            </div>
        </div>
    );
};
