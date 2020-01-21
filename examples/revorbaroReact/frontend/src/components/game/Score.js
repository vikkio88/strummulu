import React from 'react';

import './Score.css';

export default ({ me, history }) => {
    return (
        <>
            <span className="title">Score</span>
            <div className="scoreWrapper">
                <div className="cell">
                    <span className="label">You</span>
                    <span className="score">{history.filter(i => i === me).length}</span>
                </div>
                <div className="cell">
                    <span className="label">Enemy</span>
                    <span className="score">{history.filter(i => i !== me).length}</span>
                </div>
            </div>
        </>
    );
}