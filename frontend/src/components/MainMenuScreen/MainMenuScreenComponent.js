import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import UserList from '../../users/UserList';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../../globals/globalContext';

const MainMenuScreenComponent = () => {
    const navigate = useNavigate();
    const [buttonText, setButtonText] = useState('');
    var emailButtonText = "Emails senden";
    var schulungButtonText = "Schulungsübersicht";
    var achievementButtonText = "Archievementsübersicht";

    const {isLoggedIn, setLoggedIn} = useContext(LoginContext);


    const ButtonStyle = {
        margin: '5px',
        padding: '20px',
        backgroundColor: 'white',
        color: '#ec6608',
        borderColor: '#ec6608',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '50px'
    };    

    const redirectToMail = () => {
        navigate('/mail');
    };

    const redirectToLessons = () => {
        navigate('/lessons');
    };

    const Container = {
        display: 'flex',
        flexDirection: 'column',
        allignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        backgroundColor: 'white',
        width: '50%',
        padding: '20px'

    }

    


    useEffect(() => {
//    console.log("isLoggedIn: "+isLoggedIn());
    }, []);






    return (
        <div>
            <Header/>
            <div style = {Container}>
                <button style = {ButtonStyle} onClick={redirectToMail}>{emailButtonText}</button>
                <button style = {ButtonStyle} onClick={redirectToLessons}>{schulungButtonText}</button>
                <button style = {ButtonStyle} onClick={redirectToMail}>{achievementButtonText}</button>
            </div>
        </div>
    );
};

export default MainMenuScreenComponent;