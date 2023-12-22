import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../globals/globalContext';
import logo from '../images/logo_weiß.png'; // Adjust the path as needed
import userIcon from '../images/user_icon.png'; // Adjust the path as needed
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

    const LoginStyle = {
        cursor: 'pointer',
        fontSize: '2em',
        color: 'white'
    }

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

    const LoginContainer = {
        marginLeft: 'auto',
        marginBottom: '30px',
        display: 'flex',
        height: '10px'
    }

    const goToHome = () => {
            navigate('/');
    }

    return (
        <div style={HeaderStyle}>
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
                <Container style={RightContainer}>
                    <div style={LoginContainer}>
                        <p className='mt-2' onClick={login} style={LoginStyle}>Login</p>
                    </div>
                </Container>
            )}
                   
        </div>
    );
};

export default Header;