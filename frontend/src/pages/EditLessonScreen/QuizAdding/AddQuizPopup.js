import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import React, { useEffect, useState, useContext } from 'react';
import { MdDelete } from "react-icons/md";
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';
import CreateQuizScreen from '../../Quiz/createQuizScreen';

const AddQuizPopup = ({lessonTitle, setQuizData}) => {
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
              <CreateQuizScreen setQuizData={setQuizData} closePopup={handleClose}/>
            </Modal.Body>
          </Modal>
        </div>
    );
}

export default AddQuizPopup;