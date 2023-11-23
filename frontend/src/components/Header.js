import React from 'react';

const Header = () => {
    const HeaderStyle = {
        margin: '20px',
        padding: '20px',
        display : 'flex',
        backgroundColor: 'darkorange',
        color: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '80px',
        borderRadius: '10px'
    };

    const left = {
        marginRight: 'auto',
        fontSize: '2.5em'
    }

    const right = {
        marginLeft: '50px',
        fontSize: '1.5em'
    }

    return (
        <div style={HeaderStyle}>
            <p style={left}>
                Cyber-Kraftwerk
            </p>
            <p style={right}>Einstellungen</p>
            <p style={right}>Abmelden</p>
        </div>
    );
};

export default Header;