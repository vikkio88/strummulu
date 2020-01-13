import React from 'react';

export default ({ loaded }) => (
    <div>
        {loaded && <img style={styles.bulletIcon} src="assets/bullet.svg" alt="bullet loaded" />}
        {!loaded && <img style={{ ...styles.bulletIcon, ...styles.empty }} src="assets/bullet.svg" alt="bullet empty" />}
    </div>
);

const styles = {
    bulletIcon: {
        width: '80px'
    },
    empty: {
        opacity: '0.2'
    }

}