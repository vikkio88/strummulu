import React from 'react';

export default ({ children, ...others }) => {
    return (
        <input
            className="input"
            {...others}
        />
    );
}