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
        borderRadius: '10px',

    };

    const homeTextStyle = {
        marginLeft: '40px', // Closer to the logo
        marginTop: '40px', // Closer to the top
        color: 'black', // Changed text color to black
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1.7em' // Larger text size for visibility
    };

    const LogoutStyle = {
            marginLeft: '0px', // Closer to the logo
            marginRight: '40px', // Closer to the logo
            marginTop: '35px', // Closer to the top
            color: 'black', // Changed text color to black
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.7em' // Larger text size for visibility
        };

    const logoStyle = {
            height: '50px',
            cursor: 'pointer'
    };

    const userInfoBoxStyle = {
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            right: '40px',
            top: '26px',
            backgroundColor: 'white',
            border: '2px solid orange',
            padding: '5px 10px', // Increase padding for a longer box
            borderRadius: '5px',
            cursor: 'pointer',
            width: '250px', // You can set a specific width if you need to

    };

    const userDetailsStyle = {
        display: 'flex',
        flexDirection: 'column', // Stack children vertically
        alignItems: 'flex-start', // Align children to the start of the flex container
        marginRight: '10px', // Add some space to the right of the container
        fontSize: '1.1em' ,// Decrease font size for visibility
        fontWeight: 'bold' // Make the text bold
    };

    const dropdownMenuStyle = {
            display: dropdownOpen ? 'block' : 'none',
            position: 'absolute',
            backgroundColor: 'white',
            border: '2px solid orange',
            right: '40px',
            marginTop: '10px',
            borderRadius: '5px',
            zIndex: '1000',
            width: '250px',
            top: '83px'
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
                        <img src={userIcon} alt="User Icon" style={{ marginRight: '20px', marginLeft: '20px' }}/>
                        <div style={userDetailsStyle}>
                            <p style={{ margin: 0, color: 'black', fontWeight: 'bold' }}>{userV.given_name}</p>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: 'black', marginRight: '5px' }}>Level:</span>
                                <p style={{ margin: 0, color: 'orange', fontWeight: 'bold' }}>{userV.mailLevel}</p>
                            </div>
                        </div>
                        <p style={{ marginLeft: '40px', marginTop:"15px" }}>▼</p>
                    </div>
                ) : (
                    <p onClick={login} style={LogoutStyle}>Login</p>
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