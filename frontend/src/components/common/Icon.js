import React from 'react';

export default ({ type }) => (
    <img src={`assets/${type}.svg`} alt={`${type}`} />
);