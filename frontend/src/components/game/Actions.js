import React from 'react';
import { Icon } from 'components/common';

import './Actions.css';

export default ({ actions, playerId }) => {
    const other = Object.keys(actions).find(id => id != playerId);
    const myMove = actions[playerId];
    const otherMove = actions[other];
    return (
        <div class="actionsWrapper">
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
