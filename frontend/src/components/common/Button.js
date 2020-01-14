import React from 'react';

export default ({ children, small = false, ...others }) => {
    return (
        <button
            className={`btn${others.disabled ? ' btn-disabled' : ' btn-primary'}${small ? ' btn-sm' : ''} ${others.icon ? ' btn-action-icon' : ''}`}
            {...others}
        >
            {children}
        </button>
    );
}