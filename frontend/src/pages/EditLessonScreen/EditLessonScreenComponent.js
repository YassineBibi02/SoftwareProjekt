
import React, { useRef, useEffect, useState, useContext} from 'react';
import Header from '../../components/Header';
import { Button } from 'react-bootstrap';
import { useParams, useNavigate, useLocation  } from 'react-router-dom';
import AddAchievementPopup from './AchievementAdding/AddAchievementPopup';
import { useCookies } from 'react-cookie';
import AddQuizPopup from './QuizAdding/AddQuizPopup';
import { FaCheck } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import LoginContext from '../../globals/globalContext';

/**
 * EditLessonScreenComponent is a React component that allows users to edit a lesson.
 * 
 * @param {boolean} newLesson - Indicates whether it is a new lesson or an existing one.
 * @returns {JSX.Element} - The rendered EditLessonScreenComponent.
 */
const EditLessonScreenComponent = ({newLesson}) => {

    useEffect(() => {
        const handleBeforeUnload = (event) => {
          // event.preventDefault();
          // Custom logic to handle the refresh
          // Display a confirmation message or perform necessary actions
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);

    
    const { isLoggedIn, setLoggedIn, userV , login, logout} = useContext(LoginContext);
    const {state} = useLocation();
    let lesson = state?.lesson; // Read lesson passed on state for lesson edit
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const lessonID = useParams();
    const navigate = useNavigate();

    const idRef = useRef('');

    // Create wrong answers array from JSON
    function createWrongAnswers(wrongAnswers) {
        const wrongAnswersArray = [];
        for (let i = 0; i < wrongAnswers.length; i++) {
            const wrongAnswer = {id: i, value: wrongAnswers[i]};
            wrongAnswersArray.push(wrongAnswer);
        }
        return wrongAnswersArray;
    }

    // Create questions array from JSON
    const getQuestionsFromJSON = (inputJSON) => {
        const result = [];
        const questionCount = inputJSON.question_count;
        for (let i = 0; i < questionCount; i++) {
            const question = inputJSON["q" + i];
            const wrongAnswers = createWrongAnswers(question.wrong_answers);
            const rightAnswer = question.right_answer;
            const questionText = question.question;
            const questionArray = [questionText, rightAnswer, wrongAnswers];
            result.push(questionArray);
        }
        return result;
    }

    // Load id from lesson passed on state for lesson edit if it exists
    useEffect(() => {
        idRef.current = newLesson ? '' : lesson.id;
    },[]);

    // Setup Variables with lesson data

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

    const [achievementName, setAchievementName] = useState(() => {
        if (newLesson) {
            // Handle initial state for new lesson
            return "";
        } else {
            // Setup Variables with lesson data
            return "Platzhalter";
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


    const [questions, setQuestions] = useState(() => {
        if (newLesson) {
            // Handle initial state for new lesson
            return '';
        } else {
            // TODO Load from LessonEntry
            return getQuestionsFromJSON(lesson.quiz);
        }
    });

    const [errorMessageText, setErrorMessageText] = useState('');  

    const isButtonDisabled = !difficulty || (!file && newLesson) || !questions || !achievementID || !title; // Disable button if any of the fields are empty

    const showErrorMessages = ({text}) => {
        setErrorMessageText(text);
    }

    // Set quiz data from AddQuizPopup
    const setQuizData = (allQuestions) => {
        setQuestions(allQuestions);
    }


    // Fetch achievement name from achievement ID
    useEffect(() => {
        const fetchAchievementName = async () => {
            try {
                const response = await fetch('/api/methode/AchievementDetails', {
                    method: 'POST', credentials: 'include',
                    headers: {
                        'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                        'Content-Type': 'application/json',
                    },
                    body: achievementID,
                });
                const result = await response.json();
                setAchievementName(result.name);
            } catch (error) {
                console.log("Error fetching achievement name: ", error)
            }
        };
        fetchAchievementName();
    }, [achievementID]);

    // Fetch user data and check for Admin_Access role
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

    
                    
    // handleFileChange is called when the user selects a file to upload
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        console.log("File changed")
        setFileChanged(true);
    };

    // remove certain special characters to avoid displaying and saving errors with the registry
    function removeProblemCharacters(input_string) {
        let result = input_string.replace(/[üöäß§°´²³]/gi, '');
        return result;
    }

    // handleTitleChange is called when the user changes the title
    const handleTitleChange = (event) => {
        setTitle(removeProblemCharacters(event.target.value));
    };

    // createLesson sends a POST request to the backend to create a new lesson
    const createLesson = async () => {
        // Array is [title, difficulty, achievementID, fileName, questionCount, question1, wrongAnswerCount1, rightAnswer1, wrongAnswer1, wrongAnswer2,...]
        const lessonArray = [];
        lessonArray.push(title);
        lessonArray.push(getDifficulty());
        lessonArray.push(achievementID);
        lessonArray.push(file.name);
        const convertedQuestions = getQuizArray(questions);
        console.log(JSON.stringify(convertedQuestions));
        const unitedArray = lessonArray.concat(convertedQuestions);
        console.log("United Array: ", unitedArray);
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
            alert("Schulung erfolgreich hinzugefügt");
            return result;
        } catch (error) {
            console.error("Error2:", error);
            console.error("Error details:", error.message, error.response);
            // Firefox sometimes throws an error even though the lesson was created successfully
            showErrorMessages({text: "Error creating Lesson. If using Firefox, this error is likely inconsequential. Please check the Lessons Overview to see if the lesson was created."});
            return false;
        }
    }

    // editLesson sends a POST request to the backend to edit an existing lesson
    const editLesson = ({newName}) => {
        console.log("Quiz:" , questions)
        // Array is [id, title, difficulty, achievementID, fileName, questionCount, question1, wrongAnswerCount1, rightAnswer1, wrongAnswer1, wrongAnswer2,...]
        // File name is only included if the file was changed
        const lessonArray = [];
        lessonArray.push(lesson.id)
        lessonArray.push(title);
        lessonArray.push(getDifficulty());
        lessonArray.push(achievementID);
        console.log("Editing");
        if (newName) {
            lessonArray.push(file.name);
        }        
        const convertedQuestions = getQuizArray(questions);
        const unitedArray = lessonArray.concat(convertedQuestions);
        if (newName) {
            try {
                fetch('/api/methode//UpdateInRegistry', {   // If the name was changed, use UpdateInRegistry
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

        } else { // If the name was not changed, use UpdateInRegistryNoNameChange
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
    
    // delay is used to wait for the file to be uploaded before creating the lesson
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const confirm = async (event) => {
        event.preventDefault();
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
                    alert("Error uploading file");
                }
        } else {
            if (newLesson) {
                await createLesson();
            } else {
                editLesson({ newName: false });
            }
        }
        console.log("ID: ", idRef.current)
        //navigate('/lessonsOverview');
    };

    // getQuizArray converts the quiz data into an array that can be sent to the backend when appended to the lesson data
    const getQuizArray = (inputArray) => {
        const result = [];
        result.push(inputArray.length);

        inputArray.forEach((item) => {
            const [question, rightAnswer, ...wrongAnswers] = item;
            if (question !== "" && rightAnswer !== "" && wrongAnswers[0].length !== 0) {    
                result.push(question);
                result.push(wrongAnswers[0].length);
                result.push(rightAnswer);
                wrongAnswers[0].forEach((wrongAnswer) => {
                    result.push(wrongAnswer.value);
                });
            } else {
                // If the question is empty, decrease the question count by 1 and do not add the question to the array
                result[0] = result[0] - 1;
            }
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

    // getDifficulty returns the difficulty selected by the user
    const getDifficulty = () => {
        const difficultySelect = document.getElementById('difficulty-select');
        const selectedValue = difficultySelect.value;
        return selectedValue;
    }   
    
    // QuizCheckmark displays a checkmark if the quiz is valid, otherwise a cross
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
                    <p>Level: &emsp;&emsp;</p>
                    <select style={{ ...containerStyle, position: 'fixed', left: '200px' }} id='difficulty-select' value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>

                <div style={containerStyle}>
                    <p>PDF:</p>
                    <div style={{ ...containerStyle, position: 'fixed', left: '200px' }}>
                        <p>{initialPath}</p>   
                    </div>
                    <div style={{ ...containerStyle, position: 'fixed', left: '600px' }}>             
                        <input type="file" onChange={handleFileChange} />
                    </div>
                </div>

                <div style={containerStyle}>
                    <p>Quiz:</p>
                    <div style={{ ...containerStyle, position: 'fixed', left: '200px' }}>
                        <QuizCheckmark/>
                    </div>
                    <div style={{ ...containerStyle, position: 'fixed', left: '600px' }}>
                        <AddQuizPopup setQuizData={setQuizData} oldQuizData={oldQuizData} editing={!newLesson}/>                       
                    </div>         
                </div>

                <div style={containerStyle}>
                    <p>Achievement:</p>
                    <div style={{ ...containerStyle, position: 'fixed', left: '200px' }}>
                        <p>{achievementName}</p>
                    </div>
                    <div style={{ ...containerStyle, position: 'fixed', left: '600px' }}>
                        <AddAchievementPopup lessonTitle={title} setLessonAchievementID={setAchievementID}/>                 
                    </div>
                </div>
                
            </div>
            <div style={{ position: 'fixed', bottom: '50px', right: '20px' }}>
                    <Button onClick={confirm} disabled={isButtonDisabled}>Bestätigen</Button>
            </div>
            <div style={containerStyle}>
                <Button onClick={() => navigate('/lessonsOverview')}>Abbrechen</Button>
            </div>
            {errorMessageText && (
                <div style={{ backgroundColor: 'red', padding: '10px', color: 'white', position: 'fixed', bottom: 0, left: 0, width: '100%' }}>
                    {errorMessageText}
                </div>
            )}
        </div>
    );
};



export default EditLessonScreenComponent;

    
