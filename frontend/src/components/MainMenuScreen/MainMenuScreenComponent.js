import React from 'react';
import Header from '../../components/Header';
import UserList from '../../users/UserList';
import { useNavigate } from 'react-router-dom';


const MainMenuScreenComponent = () => {
    const navigate = useNavigate();

    const ButtonStyle = {
        margin: '50px',
        padding: '20px',
        backgroundColor: 'red',
        color: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '50px'
    };    

    const redirectToMail = () => {
        navigate('/mail');
    };

    const Container = {
        display: 'flex',
        allignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        backgroundColor: 'white',
    }

    return (
        <div>
            <Header/>
            <div style = {Container}> 
                <button style = {ButtonStyle} onClick={redirectToMail}>Go to Mail</button>
            </div>
        </div>
    );
};

export default MainMenuScreenComponent;