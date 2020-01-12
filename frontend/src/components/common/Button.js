import React from 'react';

export default ({ children, ...others }) => {
    return (
        <button
            className={`btn${others.disabled ? ' btn-disabled' : ' btn-primary'}${others.small ? ' btn-sm' : ''}`}
            {...others}
        >
            {children}
        </button>
    );
}