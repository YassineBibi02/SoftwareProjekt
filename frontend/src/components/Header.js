import React , {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../globals/globalContext';
import LogoImage from '../images/logo_schwarz.png';

const Header = () => {
    const {isLoggedIn, setLoggedIn,userV} = useContext(LoginContext);
    const navigate = useNavigate();

    const HeaderStyle = {
        //margin: '20px',
        padding: '20px',
        display : 'flex',
        backgroundColor: 'white',
        color: 'black',
        alignItems: 'center',
        borderBottom: '2px solid #ec6608',
    };

    const LogoContainer = {
        maxWidth: '100%',
        height: '100px',
        marginRight: '50px'
    }

    const Button = {
        fontSize: '2.5em',
        color: 'black'
    }

    const ButtonContainer = {
        display: 'flex',
        justifyContent: 'right',
        alignItems: 'center',
        color: 'black',
        marginTop: 'auto',
        backgroundColor: '#ec6608',
        border: '1px solid #ec6608',
        borderRadius: '10px',
        width: '100%',
        height: '100px'
    }

    const goToHome = () => {
        navigate('/');
    };

    const login = () => {
        navigate('/login');
    }

    return (
        <div style={HeaderStyle}>
            <img src={LogoImage} style={LogoContainer} onClick={goToHome} role='button'></img>
            <div style={ButtonContainer}>
                <p style = {{...Button, marginRight:'100px'}}>Einstellungen</p>
                {
                    isLoggedIn() ?
                    <>
                        <p style={Button}>Welcome {userV.given_name}</p>
                        <p style = {{...Button, marginRight:'50px'}} onClick={login} >Logout</p>
                    </>
                    :
                    <p style = {{...Button, marginRight:'50px'}} onClick={login} >Login</p>
                }
            </div>
        </div>
    );
};

export default Header;