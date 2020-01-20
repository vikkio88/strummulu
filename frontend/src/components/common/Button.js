import React from 'react';

export default ({ children, small = false, icon = false, ...others }) => {
    return (
        <button
            className={`btn${others.disabled ? ' btn-disabled' : ' btn-primary'}${small ? ' btn-sm' : ''} ${icon ? ' btn-action-icon' : ''}`}
            {...others}
        >
            {children}
        </button>
    );
}