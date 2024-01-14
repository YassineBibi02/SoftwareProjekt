import React from 'react';

// Represents a button for navigating to the other pages
function MenuButton({onClick, children}) {

    const ButtonStyle = {
        margin: '10px', 
        padding: '20px', 
        color: 'black',
        borderColor: 'black',
        borderRadius: '4px',
        width: '100%',
        height: '100%',
        fontSize: '3rem'
    };

    return (
        <button
            style={ButtonStyle}
            onClick={onClick}
            onMouseOver={(e) => (e.target.style.backgroundColor = 'lightgrey')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '')}
        > 
            {children}
        </button>
    );
}

export default MenuButton;