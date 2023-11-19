import React from 'react';
import Header from '../components/Header';
import UserList from '../users/UserList';
import DateSetter from './DateSetter';
import { Button } from 'react-bootstrap';

const SendMailScreenComponent = () => {

    const ButtonStyle = {
        margin: '20px',
        float: 'right',        
    };

    const DateContainerStyle = {
        justifyContent: 'space-between',
        marginBottom: '20px',
        display: 'flex',
        marginLeft: '40px',
        marginRight: '40px',
    };

    const SendMail = () => {
        console.log("SendMailPressed");
    };

    return (
        <div>
            <Header/>
            <div style={DateContainerStyle}>
                <DateSetter title={"Start Date(proto)"}/>
                <DateSetter title={"End Date(proto)"}/>
            </div>
            <UserList/>
            <Button variant="primary" size="lg" block style={ButtonStyle} onClick={SendMail}>Bestätigen</Button>
        </div>
    );
};

export default SendMailScreenComponent;