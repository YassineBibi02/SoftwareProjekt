import React, {useState, useEffect} from 'react';
import { Form, Button, Container} from 'react-bootstrap';

function CreateQuizScreen({setQuizData, closePopup}) {

    const [question, setQuestion] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [wrongAnswers, setWrongAnswers] = useState([{id:1,},{id:2},{id:3}]);

    const [questions, setQuestions] = useState([]);     // Here all the questions are stored

    const currentQuestion = [question, correctAnswer, wrongAnswers];
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [shouldSubmit, setShouldSubmit] = useState(false); // This is used to submit the quiz data to the parent component

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

    useEffect(() => {
        console.log("index:", currentQuestionIndex);
    }, [currentQuestionIndex]);

    useEffect(() => {
        if (currentQuestionIndex < questions.length) {
            setQuestion(questions[currentQuestionIndex][0]);
            setCorrectAnswer(questions[currentQuestionIndex][1]);
            setWrongAnswers(questions[currentQuestionIndex][2]);
        } else {
            setQuestion("");
            setCorrectAnswer("");
            setWrongAnswers([{ id: 1 }, { id: 2 }, { id: 3 }]);
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

    function addWrongAnswers() {
        const newWrongAnswer = {id: wrongAnswers.length + 1};
        setWrongAnswers([...wrongAnswers, newWrongAnswer]);
    }

    function deleteWrongAnswers() {
        const id = wrongAnswers.length;
        const updatedWrongAnswers = wrongAnswers.filter(answer => answer.id !== id);
        setWrongAnswers(updatedWrongAnswers);
    }

    function handleInputChange(event) {
        event.preventDefault();
        const {name, value} = event.target;
        if (name === "Question") {
            setQuestion(value);
        } else if (name === "CorrectAnswer") {
            setCorrectAnswer(value);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        addQuestion(currentQuestionIndex);      // Aus irgendeinem Grund wird hier erst beim 2. submit hinzugefügt
        setShouldSubmit(true);
        if (setQuizData != undefined) {
            setQuizData(question, correctAnswer, wrongAnswers);
            closePopup();
        } else {
            console.log("setQuizData is undefined");
        }
        console.log("These are the questions:", questions);
    }

    function addQuestion(index) {
        if (index === questions.length) {
            setQuestions([...questions, currentQuestion]);
        }
    }
      
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
            setWrongAnswers([{id:1,},{id:2},{id:3}]);
        }
    }
    
    function prevQuestion() {
        addQuestion(currentQuestionIndex);
        const index = currentQuestionIndex - 1;
        setCurrentQuestionIndex(index);
        if (index >= 0 && index < questions.length) {
            setQuestion(questions[index][0]);
            setCorrectAnswer(questions[index][1]);
            setWrongAnswers(questions[index][2]);
        }
    }

    return (
        <div>
            <Container>
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
                        <div key={wrongAnswer.id}>
                            <Form.Group className="mb-3" controlId={`WrongAnswer${index + 1}`}>
                                <Form.Label style={FormLabelStyle}>Falsche Antwort {index + 1}</Form.Label>
                                <Form.Control style={FormGroupStyle} name={`WrongAnswer${index + 1}`} />
                            </Form.Group>
                        </div>
                    ))}
                    <Button style={ButtonStyle} className="mt-3" onClick={deleteWrongAnswers}>-</Button>
                    <Button style={ButtonStyle} className="mt-3" onClick={addWrongAnswers}>+</Button>
                <div className="d-flex justify-content-end">
                    <Button style={{...ButtonStyle, backgroundColor:'#ec6608'}} className="mt-3" onClick={prevQuestion}>Vorherige Frage</Button>
                    <Button style={{...ButtonStyle, backgroundColor:'#ec6608'}} className="mt-3" onClick={nextQuestion}>Nächste Frage</Button>
                    <Button style={{...ButtonStyle, backgroundColor:'#ec6608'}} className="mt-3" onClick={handleSubmit}>Quiz Hinzufügen</Button>
                </div>
                </Form>
            </Container>
        </div>
      );
}

export default CreateQuizScreen;