import React from 'react';

const SelectedUsers = ({ usernames }) => {
    const ListStyle = {
        fontSize: '1em',
        display: 'flex',
        flexDirection: 'column', // Display names in a vertical list
        width: '30%',
        height: '100%',
        maxHeight: '550px',
        backgroundColor: 'white',
        padding: '10px',
        color: 'black',
        borderRadius: '5px',
        border: '3px solid black',
        justifyContent: 'space-between',
        overflow: 'scroll',
        margin: '0 auto',
    };

    return (
        <div style={ListStyle}>
            <h1>Ausgewählt</h1>
            {usernames.map((name, index) => (
                <p key={index}>{name}</p>
            ))}
        </div>
    );
};

export default SelectedUsers;
