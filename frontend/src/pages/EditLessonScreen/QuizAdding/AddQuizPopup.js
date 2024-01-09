import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import CreateQuizScreen from '../../Quiz/createQuizScreen';

/**
 * Renders a popup component for adding or editing a quiz.
 *
 * @param {function} setQuizData - The function to set the quiz data in the parent.
 * @param {Object} oldQuizData - The existing quiz data to edit.
 * @param {boolean} editing - Indicates whether the quiz is being edited. False indicates a new quiz is being added
 * @returns {JSX.Element} The AddQuizPopup component.
 */
const AddQuizPopup = ({setQuizData, oldQuizData, editing}) => {
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
        
    

    return (
        <div>
            <Button variant="primary"  size="sm" style={{margin: '5px'}} onClick={handleShow}>
                Quiz hinzufügen/ändern
            </Button>
          <Modal show={show} size="lg" fullscreen={true}  onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
              <CreateQuizScreen setQuizData={setQuizData} closePopup={handleClose} oldQuizData={oldQuizData} editing={editing}/>
            </Modal.Body>
          </Modal>
        </div>
    );
}

export default AddQuizPopup;