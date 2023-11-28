import React, { useState } from 'react';
import Header from '../../components/Header';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Route, Link, useParams } from 'react-router-dom';
import testPDF from '../../ressources/test.pdf';
import '../../globals/globals';


const WatchLessonScreen = () => {
    let { lessonID } = useParams();
    console.log(lessonID);

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
    };

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <h1 style={styles.lessonTitle}>Lesson {lessonID}</h1>
                <iframe title="PDF Viewer" style={styles.pdfViewer} src={testPDF} />
            </div>
        </div>
    );
}

export default WatchLessonScreen;