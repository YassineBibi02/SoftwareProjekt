import React, {useState } from 'react';
import Header from '../../components/Header';
import { Button } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf'
// style sheets for the pdf viewer; needs to be imported even if unused
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import '../../globals/globals';

// This is the screen that displays the pdf viewer and the buttons to navigate through the pdf
const WatchLessonScreen = () => {
    
    const navigate = useNavigate();
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

    // importing the worker from a reliable source
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);

    // set the right page numbers and max page numbers when they are loaded
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    // method to change the pages a bit more easier
    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }


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
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '15px',
        },
        button: {
            width: '100px',
            margin: '0 15px',
        },
        TextLayer: {
            visibility: "hidden",
        },
        AnnotationLayer: {
            visibilty: "hidden",
        },
    };

    // roll the pdf pages back
    const handleBack = () => {
        console.log("Pressed Backward")
        if (pageNumber > 1) {
            changePage(-1);
        }
    };

    // advance the pdf pages forth
    const handleForward = () => {
        console.log("Pressed Forward")
        if (pageNumber < numPages) {
            changePage(1);
        }
    };

    // redirect to the quiz screen of the lesson
    function redirectToQuizTransition() {
        navigate(`/quizTransition?id=${lessonID}`);
    }

    return (
        <div>
            <Header />
            <div style={styles.container} className='PdfDiv'>
                <h1 style={styles.lessonTitle}>{title}</h1>
                <Document 
                    file={"../../../shared-data".concat(path)}
                    onLoadSuccess={onDocumentLoadSuccess}
                    style={styles.pdfViewer}
                >
                    <Page pageNumber={pageNumber} height={document.getElementsByClassName('PdfDiv')[0]?.clientHeight*0.99 ?? 150}
                    width={document.getElementsByClassName('PdfDiv')[0]?.clientWidth*0.45 ?? 150}/>
                </Document>
                <p>
                    Seite {pageNumber || (numPages ? 1 : '--')} von {numPages || '--'}
                </p>
                <div style={styles.buttonContainer}>
                    <Button style={styles.button} disabled={pageNumber <= 1} onClick={handleBack}>Zurück</Button>
                    <Button style={styles.button} disabled={pageNumber >= numPages} onClick={handleForward}>Vorwärts</Button>
                </div>
                <div style={{ position: 'fixed', bottom: '40px', right: '40px' }}>
                    <Button style={{ fontSize: '40px' }} onClick={redirectToQuizTransition}>Quiz</Button>
                </div>
            </div>
        </div>
    );
}

export default WatchLessonScreen;
