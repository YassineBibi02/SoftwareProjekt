import React, { useCallback, useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import { Button } from 'react-bootstrap';
import { Route, Link, useParams, useLocation } from 'react-router-dom';
import testPDF from '../../ressources/test.pdf';
import pdfjs from 'pdfjs-dist/build/pdf';
//import testPDF2 from '../../ressources/test_horizontal.pdf';

import '../../globals/globals';

const WatchLessonScreen = () => {
    const {state} = useLocation();
    let lesson = state?.lesson;
    let { lessonID } = useParams();
    let path = ""
    let title = ""
    if (lesson != null) {
        console.log("Path: " , lesson.path)
        path = lesson.path.substring(lesson.path.lastIndexOf('/') );
        title = lesson.name;
        console.log("Path: " , path)
    }


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
        }
    };

    useEffect(() => {
        const iframe = document.getElementById('pdfViewer');
        iframe.onload = () => {
            console.log('iframe loaded');
            console.log(iframe.contentWindow);
        };
    }, [currentPage]);


    return (
        <div>
            <Header />
            <div style={styles.container}>
                <h1 style={styles.lessonTitle}>{title}</h1>
                <iframe
                    id="pdfViewer"
                    title="PDF Viewer"
                    src={`${path}#page=${currentPage}`}
                    style={styles.pdfViewer}
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
