
import React from 'react';
import { Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import DeleteButton from './ConfirmDeletionPopup';
/**
 * Represents a single entry in the lessons overview screen.
 * @param {Object} lessonData - The data for the lesson entry.
 * @param {boolean} admin - Indicates whether the user is an admin or not.
 * @param {Array} completed - The list of completed lesson IDs.
 * @returns {JSX.Element} The rendered lesson entry component.
 */
const LessonsEntry = ({lessonData, admin, completed}) => {    
        
        const navigate = useNavigate();

        //Styling for the lesson entry
        const EntryStyle = {
            textAlign: 'center',
            fontSize: '2em',
            backgroundColor: 'white',
            border: '3px solid black',
            padding: '10px',
            margin: '0px',
        };        
        
        //Displays a checkmark if the lesson is completed, otherwise a cross
        const CompletionIndicator = () => {
            if (completed.includes(lessonData.achievement_id)) {
                return (
                    <div style={{color: 'green'}}>✔</div>
                );
            } else {
                return (
                    <div>
                        <div style={{color: 'red'}}>✘</div>
                    </div>
                );
            }
        }
        
        //Navigates to the lesson page to view the lesson pdf
        const watchLesson = (lessonData) => {
            console.log("Navigating to lesson: " + lessonData.id)
            navigate(`/lessons/${lessonData.id}`, { state: { lesson: lessonData } })
        }

        //Navigates to the lesson edit page
        const editLesson = (lessonData) => {
            navigate(`/lessonEdit/${lessonData.id}`, { state: { lesson: lessonData } })
        }

        //Navigates to the quiz transition page to start the quiz
        function redirectToQuizTransition() {
            navigate(`/quizTransition?id=${lessonData.id}`);
        }

        //Includes the edit and delete buttons, only visible to admins
        const admin_entry = () => {            
            return (
                <Row>
                    <Col style={EntryStyle} xs={2} sm={2} md={2} lg={2}>
                        {lessonData.difficulty}
                    </Col>
                    <Col style={EntryStyle} xs={4} sm={4} md={4} lg={4}>
                        <Button onClick={() => watchLesson(lessonData)} variant="link" style={{ padding: 0, textDecoration: 'underline', fontSize: '1em' }}>{lessonData.name}</Button>
                    </Col>
                    <Col style={EntryStyle} xs={3} sm={3} md={3} lg={3}>
                        <CompletionIndicator />
                    </Col>
                    <Col style={EntryStyle} xs={6} sm={6} md={6} lg={2}>
                        <Button onClick={redirectToQuizTransition} variant="primary" size="lg" style={{margin: '0px'}}>Quiz</Button>
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
                        <Button onClick={() => watchLesson(lessonData)} variant="link" style={{ padding: 0, textDecoration: 'underline' , fontSize: '1em'}}>{lessonData.name}</Button>
                    </Col>
                    <Col style={EntryStyle} xs={3} sm={3} md={3} lg={3}>
                        <CompletionIndicator />
                    </Col>
                    <Col style={EntryStyle} xs={6} sm={6} md={6} lg={3}>
                        <Button onClick={redirectToQuizTransition} variant="primary" size="lg" style={{margin: '0px'}}>Quiz</Button>
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
    

