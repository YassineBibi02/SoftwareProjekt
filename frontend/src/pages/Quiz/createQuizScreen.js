import React, {useState, useEffect} from 'react';
import { Form, Button, Container} from 'react-bootstrap';

function CreateQuizScreen({setQuizData, closePopup, oldQuizData}) {

    const [question, setQuestion] = useState("");   // the question of a question, initially empty
    const [correctAnswer, setCorrectAnswer] = useState(""); // the correct answer of the question, initially empty
    const [wrongAnswers, setWrongAnswers] = useState([{id:0, value:""},{id:1, value:""},{id:2, value:""}]); // the wrong answers of the question, initially with 3 wrong answers and all empty

    const [questions, setQuestions] = useState([]);     // Here all the questions are stored

    const currentQuestion = [question, correctAnswer, wrongAnswers];    // the question the user currently sees on the screen
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);    // the index of the current question

    const [shouldSubmit, setShouldSubmit] = useState(false); // This is used to submit the quiz data to the parent component

    const maxQuestions = 10;    // maximum number of questions
    const maxWrongAnswers = 6;  // maximum number of wrong answers

    console.log("This is the oldQuizData:", oldQuizData);
    /*"quiz":
        {
            "question_count":2,
            "q1":
            {
                "wrong_answers":["In Schluesselloch stecken und drehen","Just use it 5head"],
                "question":"Wie verwendet man einen FIDO2 Key?",
                "right_answer":"An Rechner anschliessen und Treiber arbeiten lassen"
            },
            "id":1,
            "q0":
            {
                "wrong_answers":["ein Weg um Hundehuetten abzuschliessen","ein hunde-foermiger Schluessel"],
                "question":"Was ist ein FIDO2 Key?",
                "right_answer":"ein physikalischer Schluessel um sich Authentifizieren zu koennen"
            }
    */

    const FormGroupStyle = {
        border: '1px solid grey',
    }

    const FormLabelStyle = {
        fontSize: '1.5em'
    }

    const ButtonStyle = {
        margin: '5px',
        backgroundColor: 'grey',
        borderColor: 'grey'
    }

    // Use "useEffect", so the updates are not asynchronised
    useEffect(() => {
        if (currentQuestionIndex < questions.length && currentQuestionIndex >= 0) {
            setQuestion(questions[currentQuestionIndex][0]);
            setCorrectAnswer(questions[currentQuestionIndex][1]);
            setWrongAnswers(questions[currentQuestionIndex][2]);
        } else {
            setQuestion("");
            setCorrectAnswer("");
            setWrongAnswers([{ id: 0 , value:""}, { id: 1 , value:""}, { id: 2 , value:""}]);
        }
    }, [currentQuestionIndex, questions]);

    useEffect(() => {
        if (shouldSubmit && setQuizData) {
            setQuizData(questions);
            closePopup();
            setShouldSubmit(false); // Reset the flag
        } else if (setQuizData === undefined) {
            console.log("setQuizData is undefined");
        }
        console.log("These are the questions:", questions);
    }, [questions, setQuizData, shouldSubmit]);

    // Adds a wrong answer field
    function addWrongAnswers() {
        const newWrongAnswer = {id: wrongAnswers.length, value:""};
        setWrongAnswers([...wrongAnswers, newWrongAnswer]);
    }

    // Deletes a wrong answer field
    function deleteWrongAnswers() {
        const id = wrongAnswers.length - 1;
        const updatedWrongAnswers = wrongAnswers.filter(answer => answer.id !== id);
        setWrongAnswers(updatedWrongAnswers);
    }

    // Directly updates the values with the new inputs from user
    function handleInputChange(event, id) {
        event.preventDefault();
        const {name, value} = event.target;
        
        if (name === "Question") {
            setQuestion(value);
        } else if (name === "CorrectAnswer") {
            setCorrectAnswer(value);
        } else if (name === "WrongAnswer") {
            const updatedWrongAnswers = [...wrongAnswers];
            updatedWrongAnswers[id].value = value;
            setWrongAnswers(updatedWrongAnswers);
        }   
    }

    // Submits the quiz
    function handleSubmit(event) {
        event.preventDefault();
        addQuestion(currentQuestionIndex);
        setShouldSubmit(true);
        if (setQuizData != undefined) {
            setQuizData(question, correctAnswer, wrongAnswers);
            closePopup();
        } else {
            console.log("setQuizData is undefined");
        }
        console.log("These are the questions:", questions);
    }

    // Adds a new question
    function addQuestion(index) {
        if (index === questions.length) {
            setQuestions([...questions, currentQuestion]);
        }
    }
    
    // Jumps to next question
    function nextQuestion() {
        const index = currentQuestionIndex;
        addQuestion(index);
        setCurrentQuestionIndex(index + 1);
        if (index < questions.length) {
            setQuestion(questions[index][0]);
            setCorrectAnswer(questions[index][1]);
            setWrongAnswers(questions[index][2]);
        } else {
            setQuestion("");
            setCorrectAnswer("");
            setWrongAnswers([{id:1, value:""},{id:2, value:""},{id:3, value:""}]);
        }
    }
    
    // Jumps to previous question
    function prevQuestion() {
        if (currentQuestionIndex >= 0) {
            addQuestion(currentQuestionIndex);
            const index = currentQuestionIndex - 1;
            setCurrentQuestionIndex(index);
            if (index >= 0 && index < questions.length) {
                setQuestion(questions[index][0]);
                setCorrectAnswer(questions[index][1]);
                setWrongAnswers(questions[index][2]);
            }
        }
    }

    return (
        <div>
            <Container>
                <div className="mt-3 d-flex justify-content-center" style={{fontSize:'2em'}}>
                    <p>
                        Frage {currentQuestionIndex + 1}
                    </p>
                </div>
                <Form>
                    <Form.Group className="mb-3" controlId="Question">
                        <Form.Label style={FormLabelStyle}>Frage</Form.Label>
                        <Form.Control 
                            style={FormGroupStyle} 
                            name="Question"
                            value={question}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="CorrectAnswer">
                        <Form.Label style={FormLabelStyle}>Richtige Antwort</Form.Label>
                        <Form.Control 
                            style={FormGroupStyle} 
                            name="CorrectAnswer"
                            value={correctAnswer}
                            onChange={handleInputChange} 
                        />
                    </Form.Group>
                    {wrongAnswers.map((wrongAnswer, index) => (
                        <div key={index}>
                            <Form.Group className="mb-3">
                                <Form.Label style={FormLabelStyle}>Falsche Antwort {index + 1}</Form.Label>
                                <Form.Control 
                                    style={FormGroupStyle} 
                                    name="WrongAnswer"
                                    id={index}
                                    value={wrongAnswer.value}
                                    onChange={(event) => handleInputChange(event, index)}
                                />
                            </Form.Group>
                        </div>
                    ))}
                    <Button 
                        style={ButtonStyle} 
                        className="mt-3" 
                        onClick={deleteWrongAnswers}
                        disabled={wrongAnswers.length === 1}
                        >
                            -
                    </Button>
                    <Button 
                        style={ButtonStyle} 
                        className="mt-3" 
                        onClick={addWrongAnswers}
                        disabled={wrongAnswers.length === maxWrongAnswers}
                        >
                            +
                    </Button>
                <div className="d-flex justify-content-end">
                    <Button 
                        style={{...ButtonStyle, backgroundColor:'#ec6608'}} 
                        className="mt-3" onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        >
                            Vorherige Frage
                    </Button>
                    <Button 
                        style={{...ButtonStyle, backgroundColor:'#ec6608'}} 
                        className="mt-3" onClick={nextQuestion} 
                        disabled={currentQuestionIndex === maxQuestions - 1}
                        >
                            Nächste Frage
                    </Button>
                    <Button 
                        style={{...ButtonStyle, backgroundColor:'green'}} 
                        className="mt-3" 
                        onClick={handleSubmit}
                        >
                            Quiz Hinzufügen
                    </Button>
                </div>
                </Form>
            </Container>
        </div>
      );
}

export default CreateQuizScreen;