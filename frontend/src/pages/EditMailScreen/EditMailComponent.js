import React, { useState, useRef, useEffect } from 'react';
import Header from '../../components/Header';
import { Form, Button, Container, Modal} from 'react-bootstrap';
import { Route, Link, useParams, useNavigate, useLocation  } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function EditMailComponent() {
    const {state} = useLocation();
    let oldTemplate = state?.template;
    const navigate = useNavigate();
    //console.log("Old Template: ", oldTemplate);
    const [cookies] = useCookies(['XSRF-TOKEN']);

    const [subject, setSubject] = useState(oldTemplate[2]); // The subject of the mail with its update function
    const [text, setText] = useState(oldTemplate[3]);   // The text body of the mail with its update function
    const [level, setLevel] = useState(oldTemplate[1]); // The level of the mail with its update function

    const [showPopup, setShowPopup] = useState(false); // Sets if the popup is currently shown or not

    const [mail, setMail] = useState([])    // The mail, initially empty

    // The style of a text field
    const FormGroupStyle = {
        border: '1px solid grey',
    }

    // The style of the title of a text field
    const FormLabelStyle = {
        fontSize: '2em'
    }
    
    // The style for the submit button
    const SubmitButtonStyle = {
        backgroundColor: '#ec6608',
        borderColor: '#ec6608'
    }

    // The style for the legend button
    const LegendButtonStyle = {
        backgroundColor: '#555555',
        borderColor: '#555555'
    }
    
    // Updates the value of a variable when its changed
    function handleInputChange(event) {
        //event.preventDefault();
        const { name, value, id } = event.target;
        if (name === "Subject") {
            setSubject(value);
        } else if (name === "Text") {
            setText(value);
        } else if (name === "Level") {
            setLevel(id);
        }
    }

    // Edits the mail after the user clicks on the submit button
    function handleSubmit(event) {
        event.preventDefault();
  

        try {
            fetch('/api/methode/SaveMail', {
                      method: 'POST', credentials: 'include',
                      headers: { 
                        'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                        'Content-Type': 'application/json',
                     },
                     body: JSON.stringify(mail)
                })
                .then(response => response.text())
                .then(data => {
                    console.log("Response:", data);
                })
                .then(alert("Template Erstellt"))
        } catch (error) {
            console.error('Error', error);
        }
        navigate('/templates')
    }

    useEffect(() => {
        EditMail();
    }, [subject, text, level])

    // Push all the variables into the mail array
    function EditMail() {
        const newMail = [];
        newMail.push(text);
        newMail.push(subject);
        newMail.push(level);
        newMail.push(oldTemplate[0]);
        setMail(newMail)
    }

    function openPopup() {
        setShowPopup(true);
    }

    function closePopup() {
        setShowPopup(false);
    }

    return (
        <div>
            <Header/>
            <Container>

                {/* The formular */}
                <Form>

                    {/* Input field for subject */}
                    <Form.Group className="mb-3" controlId="SubjectInput">
                        <Form.Label style={FormLabelStyle}>Betreff</Form.Label>
                        <Form.Control
                            style={FormGroupStyle} 
                            type="subject"
                            name="Subject"
                            onChange={handleInputChange}
                            value={subject}
                        />
                    </Form.Group>

                    {/* Input field for text */}
                    <Form.Group className="mb-3" controlId="TextInput">
                        <Form.Label style={FormLabelStyle}>Textbereich</Form.Label>
                        <Form.Control 
                            style={FormGroupStyle} 
                            as="textarea" 
                            rows={10}
                            name="Text"
                            onChange={handleInputChange} 
                            value={text}
                        />
                    </Form.Group>

                    {/* Button for the legend popup */}
                    <Button
                        style={LegendButtonStyle}
                        onClick={openPopup}
                    >
                        Legende
                    </Button>

                    {/* Popup for the legend */}
                    <Modal show={showPopup} onHide={closePopup} backdrop="static">
                        <Modal.Header closeButton>
                            Beim Erstellen von Mails stehen folgende Variablen zur Verfügung, die vom System automatisch ersetzt werden:
                        </Modal.Header>
                        <Modal.Body>
                            <p>-LINK (muss in jeder Mail enthalten sein)</p>
                            <p>-EMPFAENGERVORNAME (Vorname des Empfängers)</p>
                            <p>-EMPFAENGERNACHNAME (Nachname des Empfängers)</p>
                            <p>-EMPFAENGEREMAIL (E-Mail-Adresse des Empfängers)</p>
                            <p>-KOLLEGE1VORNAME (Vorname zufälliger Kollege 1)</p>
                            <p>-KOLLEGE1NACHNAME (Nachname zufälliger Kollege 1)</p>
                            <p>-KOLLEGE1EMAIL (E-Mail-Adresse zufälliger Kollege 1)</p>
                            <p>-KOLLEGE2VORNAME (Vorname zufälliger Kollege 2)</p>
                            <p>-KOLLEGE2NACHNAME (Nachname zufälliger Kollege 2)</p>
                            <p>-KOLLEGE2EMAIL (E-Mail-Adresse zufälliger Kollege 2)</p>
                            <p>-COMPANY (Firmenname)</p>
                        </Modal.Body>
                    </Modal>
                    
                    {/* Checkboxes for levels */}
                    <Form.Group className="mb-3" controlId="LevelInput">
                        <Form.Label style={FormLabelStyle}>Level</Form.Label>
                        {['radio'].map((type) => (
                            <div key={`inline-${type}`} className="mb-3">
                                <Form.Check
                                    inline
                                    label="1"
                                    name="Level"
                                    type={type}
                                    id={1}
                                    size="lg"
                                    onChange={handleInputChange}
                                    checked={level == 1}
                                />
                                <Form.Check
                                    inline
                                    label="2"
                                    name="Level"
                                    type={type}
                                    id={2}
                                    size="lg"
                                    onChange={handleInputChange}
                                    checked={level == 2}
                                />
                                <Form.Check
                                    inline
                                    label="3"
                                    name="Level"
                                    type={type}
                                    id={3}
                                    size="lg"
                                    onChange={handleInputChange}
                                    checked={level == 3}
                                />
                            </div>
                        ))}
                    </Form.Group>

                    {/* Submit button */}
                    <div className="d-flex justify-content-center">
                        <Button style={SubmitButtonStyle} className="mt-3 btn-lg" onClick={handleSubmit} disabled={!subject || !text || !level}>Hinzufügen</Button>
                    </div>
                </Form>
            </Container>
        </div>
      );
}

export default EditMailComponent;