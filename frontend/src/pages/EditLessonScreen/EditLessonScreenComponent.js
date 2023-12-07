import React, { useState } from 'react';
import Header from '../../components/Header';
import { Button } from 'react-bootstrap';
import { Route, Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const EditLessonScreenComponent = ({newLesson}) => {

    
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const lessonID = useParams();
    const navigate = useNavigate();

    if (newLesson) {
        
    } else {
        //Setup Variables with lesson data
    }

    
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("Test"); //Load Title from lesson data here


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };


    const createLesson = () => {
        const lessonArray = [];
        lessonArray.push(title);
        lessonArray.push(getDifficulty());
        lessonArray.push("10");
        lessonArray.push("10");
        console.log(lessonArray);

        try {
          fetch('/api/methode/RegisterLesson', {
                    method: 'POST', credentials: 'include',
                    headers: { 
                      'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                      'Content-Type': 'application/json',
                   },
                   body: JSON.stringify(lessonArray)
              })
             .then(response => response.text()).then(data => console.log("Response:",data));
      } catch (error) {
          console.error('Error', error);
      }
      navigate('/lessonsOverview') //TODO does not work sometimes, on loading lessons, cant replicate reliably, solved on reloading???
    }

    const confirm = () => {
        // Handle file upload logic here
        if (newLesson) {
            createLesson();
        }
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
                    <Button onClick={confirm}>Bestätigen</Button>
            </div>
        </div>
    );
};

export default EditLessonScreenComponent;

    
