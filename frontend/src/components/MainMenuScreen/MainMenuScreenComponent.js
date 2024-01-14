import React, { useState, useEffect ,useContext} from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../../globals/globalContext';


const MainMenuScreenComponent = () => {
    const {isLoggedIn, setLoggedIn,userV ,login, setUserV, logout} = useContext(LoginContext);
    const navigate = useNavigate();
    const [buttonText, setButtonText] = useState('');
    const [adminStatus, setAdminStatus] = useState(false); 
    const [user, setUser] = useState(undefined);

    const schulungButtonText = "Schulungen";
    const achievementButtonText = "Meine Achievements";
    const adminübersichtText = "Admin";

    let roles = [];

    const Container = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around', 
        backgroundColor: 'white',
        width: '80%', 
        height: '80vh', 
        padding: '20px',
    };

    const ButtonStyle = {
        margin: '10px', 
        padding: '20px', 
        backgroundColor: 'white',
        color: 'black',
        borderColor: 'black',
        borderRadius: '4px',
        width: '100%',
        height: '15%',
        fontSize: '1.5rem'
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

    const infoContainer = {
        marginLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '33%', 
    };

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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={Container}>
                    <button style={ButtonStyle} onClick={redirectToLessons}>{schulungButtonText}</button>
                    <button style={ButtonStyle} onClick={redirectToAchievements}>{achievementButtonText}</button>
                    {
                        adminStatus && (
                            <button style={ButtonStyle} onClick={redirectToAdminOverview} >{adminübersichtText}</button>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default MainMenuScreenComponent;