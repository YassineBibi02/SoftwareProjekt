/**
 * Component for rendering a delete button with a confirmation modal.
 * 
 * @component
 * @param {Object} lessonData - The data of the lesson to be deleted.
 * @returns {JSX.Element} - The delete button component.
 */
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import React, {useState} from 'react';
import { MdDelete } from "react-icons/md";
import { useCookies } from 'react-cookie';

const DeleteButton = ({lessonData}) => {
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    //Deletes a lesson and reloads the page
    const deleteLesson = () => {
        console.log("Delete lesson pressed");
        console.log(lessonData.id);
        handleClose();
        try {
          fetch('/api/methode/RemoveFromRegistry', {
                    method: 'POST', credentials: 'include',
                    headers: { 
                      'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                      'Content-Type': 'application/json',
                   }, // <.>
                  body: JSON.stringify(lessonData.id)
              })
             .then(response => response.text()).then(data => console.log("Response:",data));
      } catch (error) {
          console.error('Error sending DeleteCommand:', error);
      }
      window.location.reload();
    }

    return (
        <>
            <Button variant="danger"  size="sm" style={{margin: '5px'}} onClick={handleShow}>
                <MdDelete color='black'/>
            </Button>
          <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>Wirklich löschen?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Möchten sie die Schulung -{lessonData.name}- wirklich löschen?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Abbrechen
              </Button>
              <Button variant="primary" onClick={deleteLesson}>
                Löschen
              </Button>
            </Modal.Footer>
          </Modal>
        </>
    );
}

export default DeleteButton;