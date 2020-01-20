import React from 'react';
import { Icon } from 'components/common';
import { playSounds } from 'libs';

import './Actions.css';
let justPlayed = false;

export default ({ actions, playerId, playSound = false }) => {
    const other = Object.keys(actions).find(id => id !== playerId);
    const myMove = actions[playerId];
    const otherMove = actions[other];
    if (playSound && !justPlayed) {
        justPlayed = !justPlayed
        playSounds([myMove, otherMove]);
    } else {
        justPlayed = !justPlayed
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
