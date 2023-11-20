import React, { useState } from 'react';
import Header from '../components/Header';
import UserList from '../users/UserList';
import DateSetter from './DateSetter';
import { Button } from 'react-bootstrap';
import SelectedUsers from './SelectedUsers';

const SendMailScreenComponent = () => {
    const [selectedUsers, setSelectedUsers] = useState([]);

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

    const SendMail = () => {
        console.log("SendMailPressed");
        const checkedCards = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
        var checkedCardNames = checkedCards.map(card => card.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('name'));
        console.log(checkedCardNames);
        console.log()
    };

    return (
        <div>
            <Header/>
            <div style={DateContainerStyle}>
                <DateSetter title={"Start Date(proto)"}/>
                <DateSetter title={"End Date(proto)"}/>
            </div>
            <div>
                <UserList onUserCardSelect={handleUserSelectionChange} />
                <SelectedUsers id="SelectedUsers" usernames={selectedUsers}/>
            </div>
            <Button variant="primary" size="lg" block style={ButtonStyle} onClick={SendMail}>Bestätigen</Button>
        </div>
    );
};

export default SendMailScreenComponent;
