import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import UserList from '../users/UserList';
import DateSetter from './DateSetter';
import { Button } from 'react-bootstrap';
import SelectedUsers from './SelectedUsers';
import axios from 'axios';

const SendMailScreenComponent = () => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [buttonText, setButtonText] = useState('');

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
        /*
        console.log("SendMailPressed");
        const checkedCards = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
        var checkedCardNames = checkedCards.map(card => card.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('name'));
        console.log(checkedCardNames);
        */
        try {
            await axios.get('http://localhost:8080');
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const fetchData = async () => {
        
        try {
            fetch('http://localhost:8080/test1234')
            .then(response => response.text())
            .then(txt => {
              console.log('Ret', txt)   
            })
        } catch (error) {
            console.error(error);
        }
        
    };

    useEffect(() => {
        //fetchData();
    }, []);

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
                {buttonText}Bestätigen
            </Button>
        </div>
    );
};

export default SendMailScreenComponent;

    

