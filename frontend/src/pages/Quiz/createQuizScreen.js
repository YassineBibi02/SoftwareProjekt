import React, {useState} from 'react';
import { Form, Button, Container} from 'react-bootstrap';

function CreateQuizScreen({setQuizData, closePopup}) {

    const [question, setQuestion] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [wrongAnswers, setWrongAnswers] = useState([{id:1},{id:2},{id:3}]);

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

    function addWrongAnswer() {
        const newWrongAnswer = {id: wrongAnswers.length + 1};
        setWrongAnswers([...wrongAnswers, newWrongAnswer]);
    }

    function deleteWrongAnswer() {
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
        console.log("This is the queestion:", question);
        console.log("This the the correct answer:", correctAnswer);
        if (setQuizData != undefined) {
            setQuizData(question, correctAnswer, wrongAnswers);
            closePopup();
        } else {
            console.log("setQuizData is undefined");
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
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="CorrectAnswer">
                        <Form.Label style={FormLabelStyle}>Richtige Antwort</Form.Label>
                        <Form.Control 
                            style={FormGroupStyle} 
                            name="CorrectAnswer"
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
                    <Button style={ButtonStyle} className="mt-3" onClick={deleteWrongAnswer}>-</Button>
                    <Button style={ButtonStyle} className="mt-3" onClick={addWrongAnswer}>+</Button>
                <div className="d-flex justify-content-end">
                    <Button style={{...ButtonStyle, backgroundColor:'#ec6608'}} className="mt-3" onClick={handleSubmit}>Quiz Hinzufügen</Button>
                </div>
                </Form>
            </Container>
        </div>
      );
}

export default CreateQuizScreen;