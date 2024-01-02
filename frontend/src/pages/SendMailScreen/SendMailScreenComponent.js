import React, { useState,useEffect, useContext } from 'react';
import Header from '../../components/Header';
import UserList from '../../users/UserList';
import DateSetter from './DateSetter';
import { Button } from 'react-bootstrap';
import SelectedUsers from './SelectedUsers';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../../globals/globalContext';

const SendMailScreenComponent = () => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    //const [buttonText, setButtonText] = useState('');
    const navigate = useNavigate();

    const [cookies] = useCookies(['XSRF-TOKEN']); // Calls the CSRF token. VERY IMPORTANT
    const [user, setUser] = useState(undefined);    
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startDateChanged, setStartDateChanged] = useState(false);
    const [endDateChanged, setEndDateChanged] = useState(false);
    
    const { isLoggedIn, setLoggedIn, userV , login, logout} = useContext(LoginContext);
//THE LOGIN BLOCK
    useEffect(() => {
        fetch('api/user', { credentials: 'include' }) // <.>
        .then(response => response.text())
        .then(body => {
        if (body === '') {
             navigate('/login');
        } else {
            const userData = JSON.parse(body);

            // Check for Admin_Access role
            if (userData.roles === undefined || userData.roles === null) {
                console.log("Bitte neu einloggen")
                logout();
            }
            if (!userData.roles.includes("Admin_Access")) {
                console.log("Access Denied. Admin Only Area")
                // If the user does not have Admin_Access, navigate to the home screen
                navigate('/');
            } else {
                // If the user has Admin_Access, continue with fetching achievements or other admin tasks
               setUser(JSON.parse(body));
            }

        }
            });
    }, []);



    const setNewStartDate = (e) => {   
        setStartDate(e);
        setStartDateChanged(true);
    };

    const setNewEndDate = (e) => {
        setEndDate(e);
        setEndDateChanged(true);
    };

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
        var checkedCardIDs = checkedCards.map(card => card.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id'));
        const startDateArray = startDate.split('-');
        const endDateArray = endDate.split('-');
        console.log("startDateArray", startDateArray);
        console.log("endDateArray", endDateArray);
        const data = {
            UIDs: checkedCardIDs,
            start_date: startDateArray,
            end_date: endDateArray
        }
        try {
            fetch('/api/methode/SendMails', {
                      method: 'POST', credentials: 'include',
                      headers: { 
                        'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                        'Content-Type': 'application/json',
                     }, // <.>
                    body: JSON.stringify(data)
                })
               .then(response => response.text()).then(data => console.log("Response:",data));
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };


const Body = user ?
         ////// noramle page
        <div>
                <Header />
                <div style={DateContainerStyle}>
                    <DateSetter title={"Start"} setDateParent={setNewStartDate}/>
                    <DateSetter title={"Ende"} setDateParent={setNewEndDate}/>
                </div>
                <div>
                    <UserList onUserCardSelect={handleUserSelectionChange} />
                    <SelectedUsers id="SelectedUsers" usernames={selectedUsers} />
                </div>
                <div>
                    <Button variant="primary" size="lg" style={ButtonStyle} onClick={SendMail} disabled={selectedUsers.length == 0 || !startDateChanged || !endDateChanged || (endDate < startDate)}>
                        Bestätigen
                    </Button>
                </div>
        </div>:

        //// sicherheite , damit man nicht sieht was er nicht sehen soll BIS WIR EINE BESSERE LöSUNG HABEN
         <p>Waiting for login</p>;


    return ( Body  );
};

export default SendMailScreenComponent;

    

