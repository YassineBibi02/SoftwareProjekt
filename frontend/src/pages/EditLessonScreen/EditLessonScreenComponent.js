
import React, { useRef, useEffect, useState, useContext} from 'react';
import Header from '../../components/Header';
import { Button } from 'react-bootstrap';
import { Route, Link, useParams, useNavigate, useLocation  } from 'react-router-dom';
import axios, { all } from 'axios';
import AddAchievementPopup from './AchievementAdding/AddAchievementPopup';
import { useCookies } from 'react-cookie';
import AddQuizPopup from './QuizAdding/AddQuizPopup';
import { FaCheck } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import LoginContext from '../../globals/globalContext';

const EditLessonScreenComponent = ({newLesson}) => {
    
    const { isLoggedIn, setLoggedIn, userV , login, logout} = useContext(LoginContext);
    const {state} = useLocation();
    let lesson = state?.lesson; // Read lesson passed on state for lesson edit
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const lessonID = useParams();
    const navigate = useNavigate();

    const idRef = useRef('');
    

    useEffect(() => {
        idRef.current = newLesson ? '' : lesson.id;
    },[]);

    const [oldQuizData, setOldQuizData] = useState(() => {
        if (newLesson) {
            // Handle initial state for new lesson
            return [];
        } else {
            // Setup Variables with lesson data
            return lesson.quiz;
        }
    });

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

    const [achievementID, setAchievementID] = useState(() => {
        if (newLesson) {
            // Handle initial state for new lesson
            return "";
        } else {
            // Setup Variables with lesson data
            return lesson.achievement_id;
        }
    });

    const [fileChanged, setFileChanged] = useState(() => {
        if (newLesson) {
            // Handle initial state for new lesson
            return true;
        } else {
            // Setup Variables with lesson data
            return false;
        }
    });

    const [quizChanged, setQuizChanged] = useState(() => {
        if (newLesson) {
            // Handle initial state for new lesson
            return true;
        } else {
            // Setup Variables with lesson data
            return false;
        }
    });


    const [questions, setQuestions] = useState(() => {
        if (newLesson) {
            // Handle initial state for new lesson
            return '';
        } else {
            // TODO Load from LessonEntry
            return '';
        }
    });

    const [errorMessageText, setErrorMessageText] = useState('');  

    const isButtonDisabled = !difficulty || (!file && newLesson) || !questions || !achievementID || !title;

    const [shouldSubmit, setShouldSubmit] = useState(false);

    const showErrorMessages = ({text}) => {
        setErrorMessageText(text);
    }

    const setQuizData = (allQuestions) => {
        setQuestions(allQuestions);
        setQuizChanged(true);
    }

    useEffect(() => {
        fetch('/api/user', { credentials: 'include' }) // <.>
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
                    }
                }
            });
    });


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        console.log("File changed")
        setFileChanged(true);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };


    const createLesson = async () => {
        const lessonArray = [];
        lessonArray.push(title);
        lessonArray.push(getDifficulty());
        lessonArray.push(achievementID);
        lessonArray.push(file.name);
        const convertedQuestions = getQuizString(questions);
        console.log(JSON.stringify(convertedQuestions));
        const unitedArray = lessonArray.concat(convertedQuestions);
        console.log("United Array: ", unitedArray);
        await delay(300);
        try {
            const response = await fetch('/api/methode/RegisterLesson', {
                method: 'POST', credentials: 'include',
                headers: {
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(unitedArray),
            });
            const result = await response.json();
            console.log("Success creating: ", result);
            idRef.current = result;
            return result;
        } catch (error) {
            console.error("Error2:", error);
            console.error("Error details:", error.message, error.response);
            showErrorMessages({text: "Error creating Lesson"});
            return false;
        }
    }

    const editLesson = ({newName}) => {
        console.log("Quiz:" , questions)
        const lessonArray = [];
        lessonArray.push(lesson.id)
        lessonArray.push(title);
        lessonArray.push(getDifficulty());
        lessonArray.push(achievementID);
        console.log("Editing");
        if (newName) {
            lessonArray.push(file.name);
        }        
        const convertedQuestions = getQuizString(questions);
        const unitedArray = lessonArray.concat(convertedQuestions);
        if (newName) {
            try {
                fetch('/api/methode//UpdateInRegistry', {
                    method: 'POST', credentials: 'include',
                    headers: { 
                        'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(unitedArray)
                })
                .then(response => response.text())
                .then(data => {
                    console.log("Response:", data);
                });
            } catch (error) {
                console.error('Error', error);
                showErrorMessages({text: "Error editing Lesson"});
            }

        } else {
            try {
                fetch('/api/methode//UpdateInRegistryNoNameChange', {
                    method: 'POST', credentials: 'include',
                    headers: { 
                        'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(unitedArray)
                })
                .then(response => response.text())
                .then(data => {
                    console.log("Response:", data);
                });
            } catch (error) {
                console.error('Error', error);
                console.error("Error details:", error.message, error.response);
                showErrorMessages({text: "Error editing Lesson"});
            }
        }
    }

    // upload spricht UploadLesson des Backends an, um ein File hochzuladen
    async function upload(formData) {
        try {
            const response = await fetch('/api/methode/UploadLesson', {
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
            console.error("Error details:", error.message, error.response);
            showErrorMessages({text: "Error uploading Lesson file"});
            return false;
        }
    }
    

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const confirm = async () => {
        // Handle file upload logic here
        if (fileChanged) {
            const formData = new FormData();
                formData.append("file", file);
                if (await upload(formData)) { // PDF wird getrennt von dem Registry hochgeladen bzw registriert
                    console.log("File uploaded");
                    if (newLesson) {
                        console.log("Trying to create new lesson");
                        const newID = await createLesson();
                        idRef.current = newID;
                    } else {
                        if (fileChanged) {
                            await editLesson({ newName: true });
                        } else {
                            await editLesson();
                        }
                    }
                } else {
                    console.log("Error uploading file");
                }
        } else {
            if (newLesson) {
                await createLesson();
            } else {
                editLesson({ newName: false });
            }
        }
        console.log("ID: ", idRef.current)
        setShouldSubmit(true);
    };

    const getQuizString = (inputArray) => {
        const result = [];
        result.push(questions.length);

        inputArray.forEach((item) => {
            const [question, rightAnswer, ...wrongAnswers] = item;
            result.push(question);
            result.push(wrongAnswers[0].length);
            result.push(rightAnswer);
            wrongAnswers[0].forEach((wrongAnswer) => {
                result.push(wrongAnswer.value);
            });
        });

        return result;
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
    
    const QuizCheckmark = () => {
        if (questions.length > 0) {
            return <FaCheck color='green'/>
        } else {
            return <RxCross1 color='red'/>
        }
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
                    <p>Quiz:&nbsp;&nbsp;</p>
                    <QuizCheckmark/>
                    <AddQuizPopup setQuizData={setQuizData} oldQuizData={oldQuizData} editing={!newLesson}/>                
                </div>

                <div style={containerStyle}>
                    <p>Achievement:&nbsp;&nbsp; {achievementID}</p>
                    <AddAchievementPopup lessonTitle={title} setLessonAchievementID={setAchievementID}/>                 
                </div>
                
            </div>
            <div style={{ position: 'fixed', bottom: '50px', right: '20px' }}>
                    <Button onClick={confirm} disabled={isButtonDisabled}>Bestätigen</Button>
            </div>
            
            <Button onClick={() => navigate('/lessonsOverview')}>Back</Button>
            {errorMessageText && (
                <div style={{ backgroundColor: 'red', padding: '10px', color: 'white', position: 'fixed', bottom: 0, left: 0, width: '100%' }}>
                    {errorMessageText}
                </div>
            )}
        </div>
    );
};



export default EditLessonScreenComponent;

    
