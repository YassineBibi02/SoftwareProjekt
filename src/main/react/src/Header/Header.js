import React from 'react';

const Header = () => {
    const HeaderStyle = {
      margin: '20px',
      marginRight: '200px',
      padding: '20px',
      fontSize: '1.5em',
      display : 'flex',
      width: '95%',  
      height: '100%',
      backgroundColor: 'white',
      color: 'black',
      borderRadius: '5px',
      border: '3px solid orange',
      cursor: 'pointer',
      justifyContent: 'space-between',
    };

    return (
        <div style={HeaderStyle}>
            <p>
                Cyber Kraftwerk
            </p>
            <button style={{ width: '20%' }}>Admin Toggle</button>
            <button style={{ width: '20%' }}>logout</button>
            <button style={{ width: '20%' }}>settings</button>
        </div>
    );
};

export default Header;
