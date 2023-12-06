import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../globals/globalContext';
import logo from '../images/Logo.png'; // Adjust the path as needed
import userIcon from '../images/user.png'; // Adjust the path as needed

const Header = () => {
    const { isLoggedIn, setLoggedIn, userV } = useContext(LoginContext);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const HeaderStyle = {
        margin: '20px',
        padding: '20px',
        display: 'flex',
        backgroundColor: 'lightgrey', // Changed to light grey
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '80px',
        borderRadius: '10px'
    };

    const homeTextStyle = {
        marginLeft: '10px', // Closer to the logo
        color: 'black', // Changed text color to black
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1.5em' // Larger text size for visibility
    };

    const logoStyle = {
            height: '50px',
            cursor: 'pointer'
        };

        const userInfoBoxStyle = {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            border: '2px solid orange',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer'
        };

        const dropdownMenuStyle = {
            display: dropdownOpen ? 'block' : 'none',
            position: 'absolute',
            backgroundColor: 'white',
            border: '2px solid orange',
            right: '20px',
            marginTop: '10px',
            borderRadius: '5px',
            zIndex: '1000'
        };

        const dropdownItemStyle = {
            padding: '10px',
            borderTop: '1px solid orange',
            color: 'black'
        };

        const goToHome = () => {
            navigate('/');
        };

        const login = () => {
            navigate('/login');
        };

        const toggleDropdown = () => {
            setDropdownOpen(!dropdownOpen);
        };

    return (
        <div style={HeaderStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={logo} style={{ height: '50px', cursor: 'pointer' }} onClick={goToHome} alt="logo"/>
                <p style={homeTextStyle} onClick={goToHome}>HOME</p>
            </div>
            <div>
                {isLoggedIn() ? (
                     <div style={userInfoBoxStyle} onClick={toggleDropdown}>
                                            <img src={userIcon} alt="User Icon" style={{ marginRight: '10px' }}/>
                                            <p>{userV.given_name}</p>
                                            <p style={{ marginLeft: '10px', marginRight: '10px' }}>{userV.level}</p>
                                            <p>▼</p>
                                        </div>
                ) : (
                    <p onClick={login} style={{ cursor: 'pointer', color: 'black' }}>Login</p>
                )}
                <div style={dropdownMenuStyle}>
                    <div style={dropdownItemStyle} onClick={goToHome}>Einstellungen</div>
                    <div style={dropdownItemStyle} onClick={goToHome}>Details/etc</div>
                    <div style={dropdownItemStyle} onClick={login}>Logout</div>
                </div>
            </div>
        </div>
    );
};

export default Header;