
import React, { useEffect, useState, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LessonsEntry from './LessonsEntry';
import { IoMdAdd } from "react-icons/io";
import LoginContext from '../../globals/globalContext';

/**
 * Renders a list of lesson entries
 * 
 * @returns {JSX.Element} The component JSX element.
 */

const LessonsList = () => {
    
    const navigate = useNavigate();
    const [adminStatus, setAdminStatus] = useState(false);  //Admin status of the user
    const [user, setUser] = useState(undefined);            //User data
    const achievementIds = user?.achievements || [];        //List of completed lessons
    const [loadedIDs, setLoadedIDs] = useState([]); 
    const [loadedLessons, setLoadedLessons] = useState([]); //List of all lessons
    const { isLoggedIn, setLoggedIn, userV , login, logout} = useContext(LoginContext);

    //Fetches all lessons and the admin status of the user
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await fetch('/api/methode/GetLessonRegistry');
                const data = await response.json();
                console.log('Raw data: ', data);
                const LessonArray = Object.values(data);
                LessonArray.pop(); // Remove the last element
                setLoadedIDs(data.taken_ids);
                setLoadedLessons(LessonArray);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchAdminStatus = async () => {
            fetch('api/user', { credentials: 'include' }) // <.>
            .then(response => response.text())
            .then(body => {
                if (body === '') {
                     navigate('/login');
                } else {
                    const userData = JSON.parse(body);
                    if (userData.roles === undefined || userData.roles === null) {
                        console.log("Bitte neu einloggen")
                        logout();
                    } else if (userData.roles.includes("Admin_Access")) {
                        setAdminStatus(true);
                        setUser(userData);
                        console.log("User: ", userData);
                    } else {
                        setAdminStatus(false);
                        setUser(userData);
                        console.log("User: ", userData);
                    }
                }
            });
        };
        fetchLessons();
        fetchAdminStatus();
    }, []);

    //Styling for the header of the lesson table
    const HeaderStyle = {
        textAlign: 'center',
        fontWeight: 'bold', 
        fontSize: '2em',
        backgroundColor: 'white',
        border: '3px solid black',
    };

    //Styling for the lesson table
    const TableStyle = {
        fontSize: '1em',
        width: '90%',
        height: '100%',
        float: 'center',
        color: 'black',
        borderRadius: '5px',
        border: '3px solid black',
        //backgroundColor: '#ec6608',
        overflow: 'hidden',
        flexDirection: 'column',
        margin: 'auto',
    };

    //Navigates to the lesson creation page
    const addLesson = () => {
        navigate('/lessonCreate');
    }  

    //Displays the lesson table for admins, including the add lesson button
    const AdminTable = () => {
        if (loadedLessons.length === 0) {
            //return No Lessons found if no lessons can be loaded
            return (
                <div>
                    <h1>No Lessons found</h1>
                    <Button style={{
                        float: 'right',
                        marginRight: '100px',
                        marginTop: '20px',
                    }}
                    onClick={addLesson}>
                        <IoMdAdd size={30} style={{
                            borderColor: '#ec6608',
                            borderRadius: '50px'}
                        }/>
                    </Button>
                </div>
            );
        }
        return (
            <div>              
                <h1 style={{marginLeft: '30px', marginBottom: '30px', fontWeight: 'bold'}}>Schulungen</h1>
                <Container style={TableStyle} fluid>
                    <Row>
                        <Col style={HeaderStyle} lg={2}>Schwierigkeit</Col>
                        <Col style={HeaderStyle} lg={4}>Titel</Col>
                        <Col style={HeaderStyle} lg={3}>Abgeschlossen</Col>
                        <Col style={HeaderStyle} lg={2}>Quiz</Col>
                        <Col style={HeaderStyle} lg={1}>Aktion</Col>
                    </Row>
                    {loadedLessons.map((lesson) => (
                        <LessonsEntry key={lesson.id} lessonData={lesson} admin={adminStatus} completed={achievementIds}/>
                    ))}
                </Container>
                <Button style={{
                    float: 'right',
                    marginRight: '100px',
                    marginTop: '20px',
                }}
                onClick={addLesson}>
                    <IoMdAdd size={30} style={{
                        borderColor: '#ec6608',
                        borderRadius: '50px'}
                    }/>
                </Button>
            </div>
        );    
    }

    //Displays the lesson table for users without the add lesson button
    const UserTable = () => {
        
        if (loadedLessons.length === 0) {
            return <p>No Lessons found</p>;
        }

        return (
            <div>              
                <h1 style={{marginLeft: '30px', marginBottom: '30px', fontWeight: 'bold'}}>Schulungen</h1>
                <Container style={TableStyle} fluid>
                    <Row>
                        <Col style={HeaderStyle} lg={2}>Schwierigkeit</Col>
                        <Col style={HeaderStyle} lg={4}>Titel</Col>
                        <Col style={HeaderStyle} lg={3}>Abgeschlossen</Col>
                        <Col style={HeaderStyle} lg={3}>Quiz</Col>
                    </Row>
                    {loadedLessons.map((lesson) => (
                        <LessonsEntry key={lesson.id} lessonData={lesson} admin={adminStatus} completed={achievementIds}/>
                    ))}
                </Container>
            </div>
        );    

    }

    if (adminStatus) {
        return <AdminTable/>;
    } else {
        return <UserTable/>;
    }
};

export default LessonsList;

    

