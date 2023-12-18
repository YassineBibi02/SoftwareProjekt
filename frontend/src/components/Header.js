import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../globals/globalContext';
import logo from '../images/logo_weiß.png'; // Adjust the path as needed
import userIcon from '../images/user.png'; // Adjust the path as needed
import logoutIcon from '../images/logout_icon.png';
import settingsIcon from '../images/settings_icon.png';
import { Container } from 'react-bootstrap';



const Header = () => {
    const { isLoggedIn, setLoggedIn, userV , login, logout} = useContext(LoginContext);
    const navigate = useNavigate();

    const HeaderStyle = {
        margin: '20px',
        marginTop: '10px',
        padding: '10px',
        display: 'flex',
        backgroundColor: '#555555', // Changed to light grey
        alignItems: 'center',
        borderRadius: '10px',
        border: '1px solid black',
    };

    const LogoStyle = {
        height: '50px',
        cursor: 'pointer'
    }

    const homeTextStyle = {
        /*
        marginLeft: '40px', // Closer to the logo
        marginTop: '40px', // Closer to the top
        color: 'black', // Changed text color to black
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1.7em' // Larger text size for visibility
        */     
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

    const IconStyle = {
        maxWidth: '50px',
        maxHeight: '50px',
        cursor: 'pointer',
        marginLeft: '30px'
    }

    const RightContainer = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }

    const IconContainer = {
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
    }

    const goToHome = () => {
            navigate('/');
    };

    return (
        <div fluid style={HeaderStyle}>
            <Container>
                <img src={logo} style={LogoStyle} onClick={goToHome} alt="logo"/>
            </Container>
            
            {isLoggedIn() ? (
                <Container style={RightContainer}>
                    <div style={IconContainer}>
                        <h1 className='mt-2'style={{fontSize: '2em', color: 'white'}}>Level: {userV.mailLevel}</h1>
                        <img src={userIcon} style={{...IconStyle, marginLeft:'50px'}}/>
                        <img src={settingsIcon} style={IconStyle}/>
                        <img src={logoutIcon} style={IconStyle} onClick={logout}/>
                    </div>
                </Container>
            ) : (
                <p onClick={login} style={LogoutStyle}>Login</p>
            )}
                   
        </div>
    );
};

export default Header;