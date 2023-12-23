import React, { useState } from 'react';
import Header from '../../components/Header';
import { Form, Button, Container} from 'react-bootstrap';
import { useCookies } from 'react-cookie';

function CreateMailComponent() {

    const [subject, setSubject] = useState(''); // The subject of the mail with its update function
    const [text, setText] = useState('');   // The text body of the mail with its update function
    const [level, setLevel] = useState(''); // The level of the mail with its update function

    const mail = [];    // The mail, initially empty

    const [cookies] = useCookies(['XSRF-TOKEN']);

    // The style of a text field
    const FormGroupStyle = {
        border: '1px solid grey',
    }

    // The style of the title of a text field
    const FormLabelStyle = {
        fontSize: '2em'
    }
    
    // The style for a button
    const ButtonStyle = {
        backgroundColor: '#ec6608',
        borderColor: '#ec6608'
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

    // Creates the mail after the user clicks on the submit button
    function handleSubmit(event) {
        event.preventDefault();
        createMail();

        try {
            fetch('/api/methode/NewMail', {
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
                });
        } catch (error) {
            console.error('Error', error);
        }

        console.log("This is the mail:", mail);

    }

    // Push all the variables into the mail array
    function createMail() {
        mail.push(text);
        mail.push(subject);
        mail.push(level);
    }
    

    return (
        <div>
            <Header/>
            <Container>
                <Form>
                    <Form.Group className="mb-3" controlId="SubjectInput">
                        <Form.Label style={FormLabelStyle}>Betreff</Form.Label>
                        <Form.Control
                            placeholder="Betreff"
                            style={FormGroupStyle} 
                            type="subject"
                            name="Subject"
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="TextInput">
                        <Form.Label style={FormLabelStyle}>Textbereich</Form.Label>
                        <Form.Control 
                            style={FormGroupStyle} 
                            as="textarea" 
                            rows={10}
                            name="Text"
                            onChange={handleInputChange} 
                        />
                    </Form.Group>
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
                                />
                                <Form.Check
                                    inline
                                    label="2"
                                    name="Level"
                                    type={type}
                                    id={2}
                                    size="lg"
                                    onChange={handleInputChange}
                                />
                                <Form.Check
                                    inline
                                    label="3"
                                    name="Level"
                                    type={type}
                                    id={3}
                                    size="lg"
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
                    </Form.Group>
                <Button style={ButtonStyle} className="mt-3" onClick={handleSubmit}>Hinzufügen</Button>
                </Form>
                
            </Container>
        </div>
      );
}

export default CreateMailComponent;