import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Button, Card, Form, Container, ListGroup} from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';

function DoQuizScreen() {

    const navigate = useNavigate();
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const queryParameter = new URLSearchParams(window.location.search);

    var lessonID = queryParameter.get("id");  // The id of the lesson the quiz belongs to
    const [userData, setUserData] = useState([]); // The user data
    const [lessonData, setLessonData] = useState([]); // The lesson data
    const [quizData, setQuizData] = useState([]); // The quiz data

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
        return "Quiz nicht bestanden"
      }
    }

    // Returns the right answer for a certain index
    function getRightAnswer(index) {
      var name = "q" + index;
      var element = quizData[name];
      return element.right_answer;
    }

    // Returns the amount of right answers given by the user
    function rightAnswerCount() {
      var count = 0;
      for (var i = 0; i < questions.length; i++) {
        if (answers[i] === getRightAnswer(i)) {
          count++;
        }
      }
      return count;
    }

    // Returns true if the given answer from the user of a certain index was right
    function rightAnswerGiven(index) {
      if (answers[index] === getRightAnswer(index)) {
        return true;
      }
      return false;
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

    // The inline styles for this page

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

        {/**Shows the quiz in a card style which consists of a form*/}
        {quizResult === null ? (
          <div>
            <h1 className="mt-5 d-flex justify-content-center">Quiz zur Schulung "{lessonData.name}"</h1>
            <Card className="mx-auto mt-5" style={CardStyle}>
              <Card.Body>

                {/**The question and the answers are seperated in a form*/}
                <Form>
                  <Form.Group controlId="formQuestion">

                    {/** The question is shown here */}
                    <Form.Label style={QuestionStyle}>
                        {lessonData && quizData && questions.length > 0 && questions[currentQuestion].question}

                    {/** The answer options are shown here in a radio checkbox style */}
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

            {/** A container under the cards for the several buttons */}
            <div className="mt-3 d-flex justify-content-center">

              {/** Button for navigating to previous question */}
              <Button variant="secondary" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
                Vorherige Frage
              </Button>

              {/** Button for navigating to next question */}
              <Button style={NextButton} className="ms-2" onClick={handleNextQuestion} disabled={(currentQuestion === questions.length - 1) || !answers[currentQuestion]}>
                Nächste Frage
              </Button>
              
              {/** Button for handling the submit */}
              {currentQuestion === questions.length - 1 && (
                  <Button variant="success" className="ms-2" onClick={handleSubmit} disabled={answers.length !== questions.length}>
                    Bestätigen
                  </Button>
              )}
            </div> 

            {/** Shows the index of the current question the user is working on */}
            <div className="mt-3 d-flex justify-content-center" style={{fontSize:'2em'}}>
              <p>
                Frage {currentQuestion + 1} von {questions.length}
              </p>
            </div>

          </div>
        ) : (
          // After submitting the quiz, the user is shown the result of the quiz
          <div className="mt-3 d-flex flex-column" style={{textAlign: 'center'}}>

            {/** Shows if the user has passed the quiz or not */}
            <p style={{ fontSize: '3em', fontWeight: 'bold', color: '#ec6608' }}>{evaluate(quizResult)}</p>

            {/** Shows the number of questions the user has gotten right */}
            <p style={{ fontSize: '1.2em', color: '#555' }}>Du hast {rightAnswerCount()} von {questions.length} Fragen richtig beantwortet.</p>

            {/** Container for showing the details of every single question */}
            <Container className='d-flex flex-column justify-content-center'>
              
              {/** Iterate through all questions */}
              {questions.map((item, index) => (
                <div 
                  style={{ marginRight: '50px', marginTop: '50px', marginBottom: '50px' }}
                  key={index}
                > 
                  {/** Container for showing a question*/}
                  <div>
                    <h1 style={{ fontSize: '2em', color: '#333' }}>Frage {index + 1}</h1>

                    {/** Listgroup for showing all the details of a question*/}
                    <ListGroup>
                      {/** The question */}
                      <ListGroup.Item style={{ fontSize: '1.2em', backgroundColor: '#f8f9fa' }}>{item.question}</ListGroup.Item>
                      {/** The right answer of the question */}
                      <ListGroup.Item style={{ fontSize: '1.1em' }}>Richtige Antwort: {getRightAnswer(index)}</ListGroup.Item>
                      {
                        rightAnswerGiven(index) == true ? ( // The given answer of the user. The color is different depending on whether the user gave the right or wrong answer.
                          <ListGroup.Item style={{ fontSize: '1.1em', color: '#28a745' }}>Deine Antwort: {answers[index]}</ListGroup.Item>
                        ) : (
                          <ListGroup.Item style={{ fontSize: '1.1em', color: '#dc3545' }}>Deine Antwort: {answers[index]}</ListGroup.Item>
                        )
                      }
                    </ListGroup>
                  </div>
                </div>
              ))}
            </Container>
            {/** The link for navigating back to the lesson overview */}
            <div>
              <Link style={LinkStyle} to="/lessonsOverview">
                Zurück zur Schulungsübersicht
              </Link>
            </div>
          </div>
        )}
      </div>
    ); 
}
  
export default DoQuizScreen;