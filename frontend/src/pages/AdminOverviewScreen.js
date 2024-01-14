import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import MenuButton from '../components/MenuButton';

function AdminOverviewScreen() {

    const navigate = useNavigate();

    const emailButtonText = "Mails verschicken";
    const nutzerVerwaltenText = "Nutzer Verwalten";
    const achievementErstellenText = "Achievement Erstellen";
    const mailErstellenText = "Template Hinzufügen";
    const templateVerwaltenText = "Templates Verwalten";

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

    const redirectToMail = () => {
        navigate('/mail');
    };

    const redirectControl = () => {
        navigate('/UserController');
    };

    const redirectCreateAchievement = () => {
        navigate('/createAchievement');
    }

    const redirectToCreateMail = () => {
        navigate('/createMail');
    }

    const redirectToTemplates = () => {
        navigate('/templates');
    }

    return (
        <div>
            <Header/>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={Container}>
                    <MenuButton style={ButtonStyle} onClick={redirectToMail}>{emailButtonText}</MenuButton>                              
                    <div style={{...Container, flexDirection:'row', width:'104%'}}>
                        <MenuButton style={ButtonStyle} onClick={redirectToCreateMail}>{mailErstellenText}</MenuButton>
                        <MenuButton style={ButtonStyle} onClick={redirectToTemplates}>{templateVerwaltenText}</MenuButton>
                    </div>
                    <MenuButton style={ButtonStyle} onClick={redirectCreateAchievement}>{achievementErstellenText}</MenuButton>
                    <MenuButton style={ButtonStyle} onClick={redirectControl}>{nutzerVerwaltenText}</MenuButton>
                    
                </div>
            </div>
        </div>
    );
}

export default AdminOverviewScreen;