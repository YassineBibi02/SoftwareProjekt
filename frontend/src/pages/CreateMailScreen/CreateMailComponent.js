import React, { useState } from 'react';
import Header from '../../components/Header';
import { Form, Button, Container} from 'react-bootstrap';

function CreateMailComponent() {

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [level, setLevel] = useState('');

    const FormGroupStyle = {
        border: '1px solid grey',
    }

    const FormLabelStyle = {
        fontSize: '2em'
    }

    const ButtonStyle = {
        backgroundColor: '#ec6608',
        borderColor: '#ec6608'
    }
    /*
    function handleInputChange(event) {
        const { name, value } = event.target;
        if (name === "Titel") {
            setTitle(value);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log('This is the title:', title);
    }
    */

    return (
        <div>
            <Header/>
            <Container>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label style={FormLabelStyle}>Titel</Form.Label>
                        <Form.Control 
                            style={FormGroupStyle} 
                            type="title" 
                            placeholder="Hier der Titel"
                            name="Title"
                            //value={title}
                            onChange={handleInputChange}
                         />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={FormLabelStyle}>Textbereich</Form.Label>
                        <Form.Control style={FormGroupStyle} as="textarea" rows={10} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label style={FormLabelStyle}>Level</Form.Label>
                        <Form.Control style={FormGroupStyle} type="level" placeholder="1 bis 3" />
                    </Form.Group>
                </Form>
                <Button style={ButtonStyle} className="mt-3">Hinzufügen</Button>
            </Container>
        </div>
      );
}

export default CreateMailComponent;