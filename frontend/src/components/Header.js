import React , {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../globals/globalContext';

const Header = () => {
    const {isLoggedIn, setLoggedIn,userV} = useContext(LoginContext);
    const navigate = useNavigate();

    const HeaderStyle = {
        margin: '20px',
        padding: '20px',
        display : 'flex',
        backgroundColor: '#ec6608',
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

    const goToHome = () => {
        navigate('/');
    };

    const login = () => {
        navigate('/login');
    }

    return (
        <div style={HeaderStyle}>
             <p style={left} onClick={goToHome} role="button" tabIndex={0}>
                            Cyber-Kraftwerk
             </p>
            <p style={right}>Einstellungen</p>
            {
                    isLoggedIn() ?
                    <>
                        <p style={right}>Welcome {userV.given_name}</p>
                        <p style={right} onClick={login} >Logout</p>
                    </>
                    :
                    <p style={right} onClick={login} >Login</p>
            }
        </div>
    );
};

export default Header;