import React, { useState } from 'react';
import Header from '../../components/Header';
import { Button } from 'react-bootstrap';
import { Route, Link, useParams } from 'react-router-dom';
import axios from 'axios';

const EditLessonScreenComponent = () => {
    let { lessonID } = useParams();
    console.log(lessonID);

    //Setup Variables with lesson data


    
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("Test"); //Load Title from lesson data here


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleUpload = () => {
        // Handle file upload logic here
        console.log("Upload pressed");
        console.log(getDifficulty());
    };

    const containerStyle = {
        fontSize: '20px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: '40px',
        marginLeft: '50px',
    }

    const getDifficulty = () => {
        const difficultySelect = document.getElementById('difficulty-select');
        const selectedValue = difficultySelect.value;
        return selectedValue;
    }

    const addAchievement = () => {
        console.log("Add achievement pressed");
    }

    const createQuiz = () => {
        console.log("Create quiz pressed");
    }
    
    return (
        <div>            
            <Header/>
            <div>
                <div style={containerStyle}>
                    <p>Titel:</p>
                    <input type="text" value={title} onChange={handleTitleChange}  style={{margin: '20px'}}/>
                </div>

                <div style={containerStyle}>
                    <p>PDF:</p>                
                    <input type="file" onChange={handleFileChange}  style={{margin: '20px'}}/>
                </div>

                <div style={containerStyle}>
                    <p>Level:</p>
                    <select style={{margin: '20px'}} id='difficulty-select'>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>

                <div style={containerStyle}>
                    <p>Quiz:&nbsp;&nbsp;&nbsp;&nbsp;</p>
                    <p>Quiz noch nicht erstellt</p>
                    <Button variant="primary" size="sm" style={{margin: '20px'}} onClick={createQuiz}>Quiz erstellen</Button>                
                </div>

                <div style={containerStyle}>
                    <p>Achievement:&nbsp;&nbsp;&nbsp;&nbsp;</p>
                    <p>Achievement noch nicht zugewiesen</p>
                    <Button variant="primary" size="sm" style={{margin: '20px'}} onClick={addAchievement}>Achievement zuweisen</Button>                 
                </div>
                
            </div>
            <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                    <Button onClick={handleUpload}>Bestätigen</Button>
            </div>
        </div>
    );
};

export default EditLessonScreenComponent;

    
