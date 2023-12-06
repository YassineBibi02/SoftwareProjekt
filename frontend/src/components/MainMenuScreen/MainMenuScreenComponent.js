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
    let roles = [];



    const ButtonStyle = {
        margin: '5px',
        padding: '20px',
        backgroundColor: 'white',
        color: '#000000',
        borderColor: '#ec6608',
        borderRadius: '50px',
        width: '100%', 
        marginBottom: '10px', 
    };    

    const redirectToMail = () => {
        navigate('/mail');
    };

    const redirectControl = () => {
            navigate('/UserController');
        };

    const redirectToLessons = () => {
        navigate('/lessons');
    };

    const redirectToAchievements = () => {
        navigate('/achievements');
    };

    const Container = {
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'center',
        borderRadius: '10px',
        backgroundColor: 'white',
        width: '66%',
        padding: '20px',
    };

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
                </div>
            </div>
        </div>
    );
};

export default MainMenuScreenComponent;