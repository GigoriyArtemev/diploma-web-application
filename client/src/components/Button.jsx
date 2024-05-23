import React from 'react';

function Button({ onClick, active, children }) {
    return (
        <button
            className={active ? 'tab-button active' : 'tab-button'}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export { Button };
