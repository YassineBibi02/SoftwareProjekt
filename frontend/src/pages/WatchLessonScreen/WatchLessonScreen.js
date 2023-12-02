import React, { useCallback, useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Route, Link, useParams } from 'react-router-dom';
import testPDF from '../../ressources/test.pdf';
//import testPDF2 from '../../ressources/test_horizontal.pdf';
import '../../globals/globals';

const WatchLessonScreen = () => {
    let { lessonID } = useParams();
    console.log(lessonID);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 112; // Replace with the actual total number of pages in the PDF

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        lessonTitle: {
            textAlign: 'center',
        },
        pdfViewer: {
            width: '70%',
            height: '700px',
            border: '3px solid #ec6608',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '15px',
        },
        button: {
            width: '100px',
            margin: '0 15px',
        },
    };

    const handleBack = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };
    
    const handleForward = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        };
    };


    useEffect(() => {
        const iframe = document.getElementById('pdfViewer');
        iframe.onload = () => {
            console.log('iframe loaded');
            console.log(iframe.contentWindow);
            // You can now try to access contentDocument here
        };
    }, [currentPage]);

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <h1 style={styles.lessonTitle}>Lesson {lessonID}</h1>
                <iframe
                    id="pdfViewer"
                    title="PDF Viewer"
                    style={styles.pdfViewer}
                    src={`${testPDF}#page=${currentPage}`}
                />
                <div style={styles.buttonContainer}>
                    <Button style={styles.button} onClick={handleBack}>Zurück</Button>
                    <Button style={styles.button} onClick={handleForward}>Vorwärts</Button>
                </div>
            </div>
        </div>
    );
}

    export default WatchLessonScreen;
