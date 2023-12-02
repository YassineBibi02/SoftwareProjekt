import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { MdDelete } from "react-icons/md";

const ConfirmDeletionPopup = ({lessonData}) => {

    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const deleteLesson = () => {
        console.log("Delete lesson pressed");
        handleClose();
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
            <Modal.Body>Möchten sie die Schulung -{lessonData.title}- wirklich löschen?</Modal.Body>
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

export default ConfirmDeletionPopup;