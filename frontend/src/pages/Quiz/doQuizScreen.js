import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Button, Card, Form, Container} from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';

function DoQuizScreen() {

    const navigate = useNavigate();
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const queryParameter = new URLSearchParams(window.location.search);

    var lessonID = queryParameter.get("id");
    const [userData, setUserData] = useState([]);
    const [lessonData, setLessonData] = useState([]);
    const [quizData, setQuizData] = useState([]);

    const [questions, setQuestions] = useState([]); // The array of the questions of the quiz and the function to update it, first initialised as empty
    const [currentQuestion, setCurrentQuestion] = useState(0);  // The current question the user sees and the function to update it, first initialised with 0
    const [answers, setAnswers] = useState(Array(questions.length).fill(''));   // Array with all submitted answers, first initialised as empty
    const [quizResult, setQuizResult] = useState(null); // The result of the quiz and the function to update it, first initialised as empty

    // Gets all the necessary data for the quiz and stores it in the associated variables
    useEffect(() => {
      try {
        fetch('/api/methode/GetLessonRegistry', {
          method: 'GET', 
          credentials: 'include',
          headers: {
            'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
            'Content-Type': 'application/json',
          }
        })
        .then(response => response.json())
        .then(data => {
          setLessonData(data[lessonID]);
          setQuizData(data[lessonID].quiz);
          setQuestions(fillQuestions(data[lessonID].quiz));
        });
      } catch (error) {
        console.error('Failed to retrieve quiz data:', error);
      }
    }, [])
    
    // Gets the data of the current user and stores it in "userData"
    useEffect(() => {
      try {
        fetch('api/user', { credentials: 'include' }) // <.>
            .then(response => response.text())
            .then(body => {
                if (body === '') {
                     navigate('/login');
                } else {
                    setUserData(JSON.parse(body));
                }
            });
      } catch (error) {
        console.error('Failed to retrieve user data:', error);
      }

    }, []);

    // Randomises the order of the elements in an array
    function randomiseArray(array) {
      var rnd;
      var temp;
      for (var i = 0; i < array.length; i++) {
        rnd = Math.floor(Math.random() * (array.length - 1));
        temp = array[i];
        array[i] = array[rnd];
        array[rnd] = temp;
      }
      return array;
    }
    
    // Returns an array with all questions of the quiz
    function fillQuestions(quizData) {
      var result = [];

      for (var i = 0; i < quizData.question_count; i++) {
        var name = "q" + i;
        var element = quizData[name];

        var options = [];
        options.push(element.right_answer);
        for (var j = 0; j < element.wrong_answers.length; j++) {
          options.push(element.wrong_answers[j]);
        }
        // ToDo: Randomise the option order
        options = randomiseArray(options);
        var question = {question: element.question, options: options}
        result.push(question);
      }
      return result;
    }

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

    // Returns a string depending on if the user passed the quiz or not
    function evaluate(result) {
      if (result == 1) {
        return "Quiz bestanden!";
      } else {
        return "Quiz nicht bestanden."
      }
    }
    
    // Sends the submitted answers to the backend
    function handleSubmit() {
      var submit = [];
      submit.push(lessonID);
      submit.push(userData.email);
      
      for (var i = 0; i < answers.length; i++) {
        submit.push(answers[i]);
      }
      try {
        fetch('/api/methode/EvaluateQuiz', {
                  method: 'POST', credentials: 'include',
                  headers: { 
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                    'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(submit)
            })
            .then(response => response.text())
            .then(data => {
                setQuizResult(data);
            });
      } catch (error) {
          console.error('Error', error);
      }
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
        maxWidth: "800px"
    }

    const LinkStyle = {
        fontSize: '1.5em',
        display: 'inline-block',
        textDecoration: 'underline',
        color: '#ec6608'
    }
    
    return (
      <div>
        <Header/>
        {quizResult === null ? (
          <div>
            <h1 className="mt-5 d-flex justify-content-center">Quiz zur Schulung "{lessonData.name}"</h1>
            <Card className="mx-auto mt-5" style={CardStyle}>
              <Card.Body>
                <Form>
                  <Form.Group controlId="formQuestion">
                    <Form.Label style={QuestionStyle}>
                        {lessonData && quizData && questions.length > 0 && questions[currentQuestion].question}
                    </Form.Label>
                      {lessonData && quizData && questions.length > 0 &&
                        questions[currentQuestion].options.map((option, index) => (
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
                        ))
                      }
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
            <div className="mt-3 d-flex justify-content-center">
              <Button variant="secondary" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
                Vorherige Frage
              </Button>
              <Button style={NextButton} className="ms-2" onClick={handleNextQuestion} disabled={(currentQuestion === questions.length - 1) || !answers[currentQuestion]}>
                Nächste Frage
              </Button>
                {currentQuestion === questions.length - 1 && (
                    <Button variant="success" className="ms-2" onClick={handleSubmit} disabled={answers.length !== questions.length}>
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
        ) : (
          <div className="mt-3 d-flex justify-content-center" style={{textAlign: 'center'}}>
            <Container>
              <p style={{fontSize: '3em'}}>{evaluate(quizResult)}</p>
              <div>
                <Link style={LinkStyle} to="/lessonsOverview">
                  Zurück zur Schulungsübersicht
                </Link>
              </div>
            </Container>
          </div>
        )}
      </div>
    ); 
}
  
export default DoQuizScreen;