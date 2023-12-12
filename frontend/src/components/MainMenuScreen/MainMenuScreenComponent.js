import React, { useState, useEffect ,useContext} from 'react';
import Header from '../../components/Header';
import UserList from '../../users/UserList';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../../globals/globalContext';


const MainMenuScreenComponent = () => {
    const {isLoggedIn, setLoggedIn,userV , setUserV} = useContext(LoginContext);
    const navigate = useNavigate();
    const [buttonText, setButtonText] = useState('');
    var emailButtonText = "Emails senden";
    var schulungButtonText = "Schulungsübersicht";
    var achievementButtonText = "Archievementsübersicht";
    var nutzerVerwaltenText = "Nutzer Verwalten";
    var achievementErstellenText = "Achievement Erstellen";
    var mailErstellenText = "Mail Erstellen";

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
        borderColor: '#ec6608',
        borderRadius: '4px',
        width: '100%',
        height: '15%',
        fontSize: '1.5rem'
    };

    const redirectToMail = () => {
        navigate('/mail');
    };

    const redirectControl = () => {
        navigate('/UserController');
    };

    const redirectToLessons = () => {
        navigate('/lessonsOverview');
    };

    const redirectToAchievements = () => {
        navigate('/achievements');
    };

    const redirectCreateAchievement = () => {
        navigate('/createAchievement');
    }

    const redirectToCreateMail = () => {
        navigate('/createMail');
    }

    const infoContainer = {
        marginLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '33%', 
    };

    useEffect(() => {
        fetch('api/user', { credentials: 'include' }) // <.>
        .then(response => response.text())
        .then(body => {
            if (body === '') {
                setLoggedIn(false);
            } else {
                setUserV({ given_name: JSON.parse(body).given_name, email: JSON.parse(body).email , mailLevel: JSON.parse(body).Level});
                roles = JSON.parse(body).roles;
                setLoggedIn(true);
            }
        });
    }, [])

    return (
        <div>
            <Header/>
            <div style={{ display: 'flex', justifyContent: 'center' }}> {/* Changed this line to center the content */}
                <div style={Container}>
                    <button style={ButtonStyle} onClick={redirectToMail}>{emailButtonText}</button>
                    <button style={ButtonStyle} onClick={redirectToLessons}>{schulungButtonText}</button>
                    <button style={ButtonStyle} onClick={redirectToAchievements}>{achievementButtonText}</button>
                    <button style={ButtonStyle} onClick={redirectControl}>{nutzerVerwaltenText}</button>
                    <button style={ButtonStyle} onClick={redirectCreateAchievement}>{achievementErstellenText}</button>
                    <button style={ButtonStyle} onClick={redirectToCreateMail}>{mailErstellenText}</button>
                </div>
            </div>
        </div>
    );
};

export default MainMenuScreenComponent;