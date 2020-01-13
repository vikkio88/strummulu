import React from 'react';

export default ({ type }) => (
    <img style={styles.icon} src={`assets/${type}.svg`} alt={`${type}`} />
);

const styles = {
    icon: {
        width: '50px'
    }
};