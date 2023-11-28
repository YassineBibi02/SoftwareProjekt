import React, { useState } from 'react';
import Header from '../../components/Header';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Link } from 'react-router-dom';

const LessonsEntry = ({lessonData}) => {

    
    
        const HeaderStyle = {
            textAlign: 'center',
            fontSize: '2em',
            backgroundColor: 'white',
            border: '3px solid black',
            padding: '10px',
            margin: '0px',
        };

        const EntryStyle = {
          margin: '0px',
          padding: '0px',
          fontSize: '0.9em',
          display: 'flex',
          width: '90%', 
          height: '100%',
          backgroundColor: 'white',
          color: 'black',
          borderRadius: '3px',
          border: '3px solid black',
          justifyContent: 'space-between',
          flexDirection: 'column',
        };
      
        const completionPercentage = parseInt(lessonData.completion); // Parse the completion string into a number
      
        return (
            <Row>
                <Col style={HeaderStyle} xs={2} sm={2} md={2} lg={2}>
                    {lessonData.difficulty}
                </Col>
                <Col style={HeaderStyle} xs={4} sm={4} md={4} lg={4}>
                    <Link to={`/lessons/${lessonData.id}`}>{lessonData.title}</Link>
                </Col>
                <Col style={HeaderStyle} xs={3} sm={3} md={3} lg={3}>
                    {lessonData.completion}
                    <ProgressBar now={completionPercentage} />
                </Col>
                <Col style={HeaderStyle} xs={6} sm={6} md={6} lg={3}>
                    {lessonData.quiz}
                    <Button variant="primary" size="sm" style={{margin: '0px'}}>Quiz</Button>
                </Col>
            </Row>
        );
    };

    export default LessonsEntry;
    

