import React, { useState } from 'react';
import Header from '../../components/Header';
import UserList from '../../users/UserList';
import DateSetter from './DateSetter';
import { Button } from 'react-bootstrap';
import SelectedUsers from './SelectedUsers';
import axios from 'axios';

const SendMailScreenComponent = () => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    //const [buttonText, setButtonText] = useState('');

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
            const response = await axios.post('http://localhost:8080/SendEmail', checkedCardNames);
            console.log('Email sent successfully');
            console.log('Response:', response.data); // Print out the returned string
        } catch (error) {
            console.error('Error sending email:', error);
        }        
    };

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

    

