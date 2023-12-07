import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import UserList from '../../users/UserList';
import { useNavigate } from 'react-router-dom';
import EmployeeInfo from './EmployeeInfo.js';
const MainMenuScreenComponent = () => {
    const navigate = useNavigate();
    const [buttonText, setButtonText] = useState('');
    var emailButtonText = "Emails senden";
    var schulungButtonText = "Schulungsübersicht";
    var achievementButtonText = "Archievementsübersicht";
    var nutzerVerwaltenText = "Nutzer Verwalten";

    const ButtonStyle = {
        backgroundColor: 'white',
        color: '#333',
        fontSize: '1.5rem',
        borderColor: '#ec6608',
        borderRadius: '50px',
        width: '100%', 
        height: '150%',
        marginBottom: '15px', 
        marginLeft: '30px'

    };    

    const redirectToMail = () => {
        navigate('/mail');
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
        alignItems: 'space-between',
        borderRadius: '10px',
        backgroundColor: 'white',
        width: '66%',
        paddingTop: '20px',
        height: '60vh'
    };

    const infoContainer = {
        marginLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '33%', 
    };

/*    const fetchData = async () => {        
        try {
            fetch('http://localhost:8080/test1234')
            .then(response => response.text())
            .then(txt => {
              setButtonText(txt);
            });
        } catch (error) {
            console.error(error);
        }    
    };
*/
    useEffect(() => {
        //fetchData();
    }, []);

    return (
        <div>
            <Header/>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={Container}>
                    <button style={ButtonStyle} onClick={redirectToMail}>{emailButtonText}</button>
                    <button style={ButtonStyle} onClick={redirectToLessons}>{schulungButtonText}</button>
                    <button style={ButtonStyle} onClick={redirectToAchievements}>{achievementButtonText}</button>
                    <button style={ButtonStyle} onClick={redirectToMail}>{nutzerVerwaltenText}</button>  
                </div>
                <div style={infoContainer}>
                    <EmployeeInfo name="Max Mustermann" level={"1"} />
                </div>
            </div>
        </div>
    );
};

export default MainMenuScreenComponent;