import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import DeleteButton from './ConfirmDeletionPopup';

const LessonsEntry = ({lessonData, admin}) => {    
        
        const navigate = useNavigate();
        
        const EntryStyle = {
            textAlign: 'center',
            fontSize: '2em',
            backgroundColor: 'white',
            border: '3px solid black',
            padding: '10px',
            margin: '0px',
        };        
      
        const completionPercentage = parseInt(lessonData.completion); // Parse the completion string into a number
        
        const editLesson = (lessonData) => {
            navigate(`/lessonEdit/${lessonData.id}`)
        }

        //Includes the edit and delete buttons
        const admin_entry = () => {            
            return (
                <Row>
                    <Col style={EntryStyle} xs={2} sm={2} md={2} lg={2}>
                        {lessonData.difficulty}
                    </Col>
                    <Col style={EntryStyle} xs={4} sm={4} md={4} lg={4}>
                        <Link to={`/lessons/${lessonData.id}`}>{lessonData.name}</Link>
                    </Col>
                    <Col style={EntryStyle} xs={3} sm={3} md={3} lg={3}>
                        {lessonData.completion}
                        <ProgressBar now={completionPercentage} />
                    </Col>
                    <Col style={EntryStyle} xs={6} sm={6} md={6} lg={2}>
                        <Button variant="primary" size="lg" style={{margin: '0px'}}>Quiz</Button>
                    </Col>
                    <Col style={EntryStyle} xs={6} sm={6} md={6} lg={1}>                    
                        <Button variant="dark" size="sm" style={{margin: '5px'}} onClick={() => editLesson(lessonData)}>
                            <FaEdit color='white' />
                        </Button>
                        <DeleteButton lessonData={lessonData}/>
                    </Col>
                </Row>
            );
        }

        //Does not include the edit and delete buttons, makes quiz column slightly bigger
        const user_entry = () => {
            return (
                <Row>
                    <Col style={EntryStyle} xs={2} sm={2} md={2} lg={2}>
                        {lessonData.difficulty}
                    </Col>
                    <Col style={EntryStyle} xs={4} sm={4} md={4} lg={4}>
                        <Link to={`/lessons/${lessonData.id}`}>{lessonData.title}</Link>
                    </Col>
                    <Col style={EntryStyle} xs={3} sm={3} md={3} lg={3}>
                        {lessonData.completion}
                        <ProgressBar now={completionPercentage} />
                    </Col>
                    <Col style={EntryStyle} xs={6} sm={6} md={6} lg={3}>
                        <Button variant="primary" size="lg" style={{margin: '0px'}}>Quiz</Button>
                    </Col>
                </Row>
            );
        }
        if (admin) {
            return admin_entry();
        } else {
            return user_entry();
        }
    };

    export default LessonsEntry;
    

