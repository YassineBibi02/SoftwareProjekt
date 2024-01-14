import React, { useState, useEffect ,useContext} from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../../globals/globalContext';
import MenuButton from '../MenuButton';


const MainMenuScreenComponent = () => {
    const {isLoggedIn, setLoggedIn,userV ,login, setUserV, logout} = useContext(LoginContext);
    const navigate = useNavigate();
    const [buttonText, setButtonText] = useState('');
    const [adminStatus, setAdminStatus] = useState(false); 
    const [user, setUser] = useState(undefined);

    const schulungButtonText = "Schulungen";
    const achievementButtonText = "Meine Achievements";
    const adminübersichtText = "Adminübersicht";

    let roles = [];

    const Container = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around', 
        backgroundColor: 'white',
        width: '80%', 
        height: '400px', 
        padding: '20px',
    };

    const fetchAdminStatus = async () => {
        fetch('api/user', { credentials: 'include' })
        .then(response => response.text())
        .then(body => {
            if (body === '') {
                 navigate('/login');
            } else {
                const userData = JSON.parse(body);
                if (userData.roles === undefined || userData.roles === null) {
                    console.log("Bitte neu einloggen")
                    logout();
                } else if (userData.roles.includes("Admin_Access")) {
                    setAdminStatus(true);
                    setUser(userData);
                    console.log("User: ", userData);
                } else {
                    setAdminStatus(false);
                    setUser(userData);
                    console.log("User: ", userData);
                }
            }
        });
    };

    const redirectToLessons = () => {
        navigate('/lessonsOverview');
    };

    const redirectToAchievements = () => {
        navigate('/achievements');
    };

    const redirectToAdminOverview = () => {
        navigate('/adminOverview');
    }

    useEffect(() => {
        fetch('api/user', { credentials: 'include' })
        .then(response => response.text())
        .then(body => {
            if (body === '') {
                setLoggedIn(false);
                login();
            } else {
                setUserV({ given_name: JSON.parse(body).given_name, email: JSON.parse(body).email , mailLevel: JSON.parse(body).Level});
                roles = JSON.parse(body).roles;
                setLoggedIn(true);
            }
        });
        fetchAdminStatus();
    }, [])

    return (
        <div>
            <Header/>
            <div style={{textAlign: 'center', marginTop: '20px', marginBottom: '20px', color: '#ec6608' }}>
                <h2 style={{ fontSize: '4rem' }}>Willkommen!</h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={Container}>
                    <MenuButton onClick={redirectToLessons}>{schulungButtonText}</MenuButton>
                    <MenuButton onClick={redirectToAchievements}>{achievementButtonText}</MenuButton>
                </div>
            </div>
            {
                adminStatus && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{...Container, height: '200px'}}>
                            <MenuButton onClick={redirectToAdminOverview} >{adminübersichtText}</MenuButton>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default MainMenuScreenComponent;