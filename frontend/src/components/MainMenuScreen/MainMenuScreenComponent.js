import React from 'react';
import Header from '../../components/Header';
import UserList from '../../users/UserList';
import { useNavigate } from 'react-router-dom';


const MainMenuScreenComponent = () => {
    const navigate = useNavigate();

    const redirectToMail = () => {
        navigate('/mail');
    };

    return (
        <div>
            <Header/>
            <button onClick={redirectToMail}>Go to Mail</button>
        </div>
    );
};

export default MainMenuScreenComponent;