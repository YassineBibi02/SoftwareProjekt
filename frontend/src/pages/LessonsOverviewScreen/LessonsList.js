import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LessonsEntry from './LessonsEntry';
import { IoMdAdd } from "react-icons/io";

const LessonsList = () => {
    
    const navigate = useNavigate();
    const [adminStatus, setAdminStatus] = useState(false); 

    const [loadedIDs, setLoadedIDs] = useState([]); 
    const [loadedLessons, setLoadedLessons] = useState([]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/methode/GetLessonRegistry');
                console.log('Raw data: ', response.data)
                const LessonArray = Object.values(response.data);
                LessonArray.pop(); // Remove the last element
                setLoadedIDs(response.data.taken_ids);
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
                    if (userData.roles.includes("Admin_Access")) {
                        setAdminStatus(true);
                    }
                }
            });
        };
        fetchLessons();
        fetchAdminStatus();
    }, []);

    const HeaderStyle = {
        textAlign: 'center',
        fontWeight: 'bold', 
        fontSize: '2em',
        backgroundColor: 'white',
        border: '3px solid black',
    };

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

    const addLesson = () => {
        navigate('/lessonCreate');
    }  

    const AdminTable = () => {
        if (loadedLessons.length === 0) {
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
                <Container style={TableStyle} fluid="true">
                    <Row>
                        <Col style={HeaderStyle} lg={2}>Schiwerigkeit</Col>
                        <Col style={HeaderStyle} lg={4}>Titel</Col>
                        <Col style={HeaderStyle} lg={3}>Fortschritt</Col>
                        <Col style={HeaderStyle} lg={2}>Quiz</Col>
                        <Col style={HeaderStyle} lg={1}>Aktion</Col>
                    </Row>
                    {loadedLessons.map((lesson) => (
                        <LessonsEntry key={lesson.id} lessonData={lesson} admin={adminStatus}/>
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

    const UserTable = () => {
        
        if (loadedLessons.length === 0) {
            return <p>No Lessons found</p>;
        }

        return (
            <div>              
                <h1 style={{marginLeft: '30px', marginBottom: '30px', fontWeight: 'bold'}}>Schulungen</h1>
                <Container style={TableStyle} fluid="true">
                    <Row>
                        <Col style={HeaderStyle} lg={2}>Difficulty</Col>
                        <Col style={HeaderStyle} lg={4}>Title</Col>
                        <Col style={HeaderStyle} lg={3}>Completion</Col>
                        <Col style={HeaderStyle} lg={3}>Quiz</Col>
                    </Row>
                    {loadedLessons.map((lesson) => (
                        <LessonsEntry key={lesson.id} lessonData={lesson} admin={adminStatus}/>
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

    

