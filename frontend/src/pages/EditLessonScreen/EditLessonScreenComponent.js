import React, { useState} from 'react';
import Header from '../../components/Header';
import { Button } from 'react-bootstrap';
import { Route, Link, useParams, useNavigate, useLocation  } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const EditLessonScreenComponent = ({newLesson}) => {

    const {state} = useLocation();
    let lesson = state?.lesson; // Read lesson passed on state for lesson edit
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const lessonID = useParams();
    const navigate = useNavigate();
    const [initialPath, setInitialPath] = useState(() => {
        if (newLesson) {
            // Handle initial state for new lesson
            return "";
        } else {
            // Setup Variables with lesson data
            return lesson.path;
        }
    });
    const [difficulty, setDifficulty] = useState(() => {
        if (newLesson) {
            // Handle initial state for new lesson
            return 1;
        } else {
            // Setup Variables with lesson data
            return lesson.difficulty;
        }
    });

    const [file, setFile] = useState(() => {
        if (newLesson) {
            // Handle initial state for new lesson
            return "";
        } else {
            // Setup Variables with lesson data
            return lesson.path;
        }
    });


    const [title, setTitle] = useState(() => {
        if (newLesson) {
            // Handle initial state for new lesson
            return "";
        } else {
            // Setup Variables with lesson data
            return lesson.name;
        }
    });

    let fileChanged = false;

    


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        console.log("File changed")
        fileChanged = true;
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
        lessonArray.push(file.name);
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
              .then(response => response.text())
              .then(data => {
                  console.log("Response:", data);
                  navigate('/lessonsOverview');
              });
      } catch (error) {
          console.error('Error', error);
      }
    }

    const editLesson = () => {
        const lessonArray = [];
        lessonArray.push(lesson.id)
        lessonArray.push(title);
        lessonArray.push(getDifficulty());
        lessonArray.push("10");
        lessonArray.push("10");
        lessonArray.push(file.name);
        console.log("Editing");
        console.log(lessonArray);

        try {
            fetch('/api/methode//UpdateInRegistry', {
                method: 'POST', credentials: 'include',
                headers: { 
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lessonArray)
            })
            .then(response => response.text())
            .then(data => {
                console.log("Response:", data);
                navigate('/lessonsOverview');
            });
        } catch (error) {
            console.error('Error', error);
        }
    }

    // upload spricht UploadLesson des Backends an
    async function upload(formData) {
        try {
            const response = await fetch('/api/methode//UploadLesson', {
                method: 'POST', credentials: 'include',
                headers: {
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                },
                body: formData,
            });
            const result = await response.json();
            console.log("Success:", result);
            return true;
        } catch (error) {
            console.error("Error2:", error);
            return false;
        }
    }
    

    const confirm = async () => {
        // Handle file upload logic here
        if (fileChanged) {
            const formData = new FormData();
            formData.append("file", file);
            if (await upload(formData)) { // PDF wird getrennt von dem Registry hochgeladen bzw registriert
                console.log("File uploaded");
                if (newLesson) {
                    createLesson();
                } else {
                    editLesson();
                }
            } else {
                console.log("Error uploading file");
            }
        } else {
            console.log("File not changed");
            const formData = new FormData();
            formData.append("file", file);
            if (await upload(formData)) { // PDF wird getrennt von dem Registry hochgeladen bzw registriert
                console.log("File uploaded");
                if (newLesson) {
                    createLesson();
                } else {
                    editLesson();
                }
            } else {
                console.log("Error uploading file");
            }
        }
        navigate('/lessonsOverview');
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
                    <p>PDF: {initialPath}</p>                
                    <input type="file" onChange={handleFileChange}  style={{margin: '20px'}}/>
                </div>

                <div style={containerStyle}>
                    <p>Level:</p>
                    <select style={{margin: '20px'}} id='difficulty-select' value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
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

    
