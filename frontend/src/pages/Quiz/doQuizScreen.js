import React, { useState } from 'react';
import Header from '../../components/Header';
import { Button, Card, Form} from 'react-bootstrap';

function DoQuizScreen() {
  
    const questions = [
      {
        question: "Was ist die richtige Antwort?",
        options: ["Antwort 1", "Antwort 2", "Antwort 3", "Antwort 4", "Antwort 5"],
      },
      {
        question: "Was ist die richtige Antwort?",
        options: ["Antwort 1", "Antwort 2", "Antwort 3", "Antwort 4", "Antwort 5"],
      },
      {
        question: "Was ist die richtige Antwort?",
        options: ["Antwort 1", "Antwort 2", "Antwort 3", "Antwort 4", "Antwort 5"],
      },
      {
        question: "Was ist die richtige Antwort?",
        options: ["Antwort 1", "Antwort 2", "Antwort 3", "Antwort 4", "Antwort 5"],
      },
      
    ];
    
    const [currentQuestion, setCurrentQuestion] = useState(0);  // The current question and the function to update it, first initialised with 0
    const [answers, setAnswers] = useState(Array(questions.length).fill(''));   // Array with all submitted answers, first initialised as empty

    // Updates current question when going to next question. If its the last question, do nothing
    function handleNextQuestion() {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    };
    
    // Updates current question when going to previous question. If its the first question, do nothing
    function handlePrevQuestion() {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      }
    };
    
    // Updates answers with selected answer of current question
    function handleAnswerChange(event) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = event.target.value;
      setAnswers(newAnswers);
    };
  
    function handleSubmit() {
      console.log('Submitted Answers:', answers);
      // TODO: Logik für angegebenen Antworten implementieren
    };

    const NextButton = {
        backgroundColor: '#ec6608',
        borderColor: '#ec6608',
    }

    const QuestionStyle = {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '3em'
    }

    const AnswerStyle = {
        fontSize: '2em',
        borderColor: '#ec6608'
    }

    const CardStyle = {
        maxWidth: "800px",
        //backgroundColor: "lightgrey",
        //borderColor: '#ec6608'
    }
  
    return (
      <div>
        <Header/>
        <h1 className="mt-5 d-flex justify-content-center">Quiz zur Schulung xy</h1>
        <Card className="mx-auto mt-5" style={CardStyle}>
          <Card.Body>
            <Form>
              <Form.Group controlId="formQuestion">
                <Form.Label style={QuestionStyle}>
                    {questions[currentQuestion].question}
                </Form.Label>
                {questions[currentQuestion].options.map((option, index) => (
                <Form.Check
                    className='mt-3'
                    style={AnswerStyle}
                    key={index}
                    type="radio"
                    label={option}
                    name="answer"
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={handleAnswerChange}
                />
                ))}
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
  
        <div className="mt-3 d-flex justify-content-center"> {/*mt-3 steht für margin-top mit value 3*/}
          <Button variant="secondary" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
            Vorherige Frage
          </Button>
          <Button style={NextButton} className="ms-2" onClick={handleNextQuestion} disabled={currentQuestion === questions.length - 1}>
            Nächste Frage
          </Button>
            {currentQuestion === questions.length - 1 && (
                <Button variant="success" className="ms-2" onClick={handleSubmit}>
                Bestätigen
                </Button>
            )}
        </div>
  
        <div className="mt-3 d-flex justify-content-center" style={{fontSize:'2em'}}>
          <p>
            Frage {currentQuestion + 1} von {questions.length}
          </p>
        </div>
      </div>
    );
}
  
export default DoQuizScreen;