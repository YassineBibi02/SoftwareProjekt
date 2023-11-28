import React, { useState } from 'react';
import Header from '../../components/Header';
import UserList from '../../users/UserList';
import DateSetter from './DateSetter';
import { Button } from 'react-bootstrap';
import SelectedUsers from './SelectedUsers';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const SendMailScreenComponent = () => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    //const [buttonText, setButtonText] = useState('');
    const navigate = useNavigate();
    const [cookies] = useCookies(['XSRF-TOKEN']); // <.>

    const ButtonStyle = {
        margin: '20px',
        position: 'absolute',
        bottom: '0',
        right: '0',
    };

    const DateContainerStyle = {
        justifyContent: 'space-between',
        marginBottom: '20px',
        display: 'flex',
        marginLeft: '40px',
        marginRight: '40px',
    };

    const handleUserSelectionChange = () => {
        console.log("handleUserSelectionChange111111");
        const checkedCards = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
        const checkedCardNames = checkedCards.map(card => card.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('name'));
        setSelectedUsers(checkedCardNames);
    };

    const SendMail = async () => {        
        console.log("SendMailPressed");
        const checkedCards = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
        var checkedCardNames = checkedCards.map(card => card.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('mail'));
        console.log(checkedCardNames);        
        try {
            //const response = await axios.post('http://localhost:8080/api/methode/SendEmail', checkedCardNames);
            fetch('/api/methode/SendEmail', {
                      method: 'POST', credentials: 'include',
                      headers: { 'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] }, // <.>
                       body: checkedCardNames
                })
               .then(response => response.text()).then(data => console.log("Response:",data));
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }        
    };

    const login = () => {
    navigate('/login');
    }

    if(cookies['XSRF-TOKEN']==undefined){
        return (
            <div>
                <Header />
                <h1>Bitte einloggen</h1>
                <Button variant="primary" size="lg" style={ButtonStyle} onClick={login}>
                    Einloggen
                </Button>
            </div>
        );
    }


    return (
        <div>
            <Header />
            <div style={DateContainerStyle}>
                <DateSetter title={"Start (proto)"} />
                <DateSetter title={"Ende (proto)"} />
            </div>
            <div>
                <UserList onUserCardSelect={handleUserSelectionChange} />
                <SelectedUsers id="SelectedUsers" usernames={selectedUsers} />
            </div>
            <Button variant="primary" size="lg" style={ButtonStyle} onClick={SendMail} disabled={selectedUsers.length == 0}>
                Bestätigen
            </Button>
        </div>
    );
};

export default SendMailScreenComponent;

    

