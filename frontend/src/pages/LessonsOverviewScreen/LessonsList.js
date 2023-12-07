import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../../components/Header';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { ListGroup } from 'react-bootstrap';
import LessonsEntry from './LessonsEntry';
import { IoMdAdd } from "react-icons/io";

const LessonsList = () => {

    const admin_status = true;

    const [loadedIDs, setLoadedIDs] = useState([]); 
    const lessonEntries = [
        { id: 1, title: 'Lesson 1', difficulty: '1', completion: '100%', quiz: 'true', },
        { id: 2, title: 'Lesson 2', difficulty: '2', completion: '50%', quiz: 'false'  },
        { id: 3, title: 'Lesson 3', difficulty: '3', completion: '0%', quiz: 'false'  },
    ];
    const jsonString = '{"0":{"difficulty":2,"path":"frontendf","quiz_id":3,"achievement_id":3,"name":"Hashing","id":0},"1":{"difficulty":3,"path":"pdf","quiz_id":5,"achievement_id":5,"name":"FIDO2 Keys","id":1},"2":{"difficulty":2,"path":"frontenddf","quiz_id":4,"achievement_id":4,"name":"Social Engineering","id":2},"taken_ids":[1,0,2]}';
    const [loadedLessons, setLoadedLessons] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/methode/GetLessonRegistry');
                console.log('Raw data: ', response.data)
                const parsedData = JSON.parse(jsonString);
                const LessonArray = Object.values(parsedData);
                LessonArray.pop(); // Remove the last element
                setLoadedIDs(parsedData.taken_ids);
                setLoadedLessons(LessonArray);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
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
        console.log("Add lesson pressed");
        console.log(loadedLessons);
    }  

    const AdminTable = () => {
        if (loadedLessons.length === 0) {
            return <p>Loading...</p>;
        }
        return (
            <div>              
                <h1 style={{marginLeft: '30px', marginBottom: '30px', fontWeight: 'bold'}}>Schulungen</h1>
                <Container style={TableStyle} fluid="true">
                    <Row>
                        <Col style={HeaderStyle} lg={2}>Difficulty</Col>
                        <Col style={HeaderStyle} lg={4}>Title</Col>
                        <Col style={HeaderStyle} lg={3}>Completion</Col>
                        <Col style={HeaderStyle} lg={2}>Quiz</Col>
                        <Col style={HeaderStyle} lg={1}>Actions</Col>
                    </Row>
                    {loadedLessons.map((lesson) => (
                        <LessonsEntry key={lesson.id} lessonData={lesson} admin={admin_status}/>
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
                    {lessonEntries.map((lesson) => (
                        <LessonsEntry key={lesson.id} lessonData={lesson} admin={admin_status} />
                    ))}
                </Container>
            </div>
        );    

    }

    if (admin_status) {
        return <AdminTable/>;
    } else {
        return <UserTable/>;
    }
};

export default LessonsList;

    

