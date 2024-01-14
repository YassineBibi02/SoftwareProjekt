import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Header from '../../components/Header';

function TransitionScreen() {

    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const lessonID = searchParams.get('id'); // The ID of the lesson

    // The percentage at which the quiz is passed
    const passBoundary = 75;

    // Navigates to doQuiz screen
    function redirectToQuiz() {
        navigate(`/doQuiz?id=${lessonID}`);
    }

    
    const ContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    }

    const ButtonStyle = {
        backgroundColor: '#ec6608',
        borderColor: '#ec6608'
    }

    return (
        <div>
            <Header/>
            <div style={ContainerStyle}>
                <h1>Du bestehst das Quiz, wenn du mindestens {passBoundary}% der Fragen richtig beantwortet hast.</h1>
                <h1 className='mt-5'>Klicke auf den Button, um das Quiz zu starten.</h1>
                <Button style={ButtonStyle} className='mt-2' onClick={redirectToQuiz} size="lg">Quiz starten</Button>
            </div>
        </div>
    );
}

export default TransitionScreen;