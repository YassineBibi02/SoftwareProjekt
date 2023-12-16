import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import React, { useEffect, useState, useContext } from 'react';
import { MdDelete } from "react-icons/md";
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';
import AchievementList from './AchievementList';


const AddAchievementPopup = ({lessonTitle, setLessonAchievementID}) => {
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const [selectedAchievementID, setSelectedAchievementID] = useState([]);

    const handleSelection = (achievementID) => {
      console.log("Achievement ID: " + achievementID);
      setSelectedAchievementID(achievementID);
      const achievementEntries = document.getElementsByClassName("achievement3");
      
      for (let i = 0; i < achievementEntries.length; i++) {
        const achievementEntry = achievementEntries[i];
        if (achievementEntry.id == achievementID) {
          achievementEntry.style.backgroundColor = "rgba(0, 0, 255, 0.2)";
          console.log("Achievement ID: " + achievementID)
        } else {
          achievementEntry.style.backgroundColor = "#f7f7f7";
        }
      }
    }

    const confirmChoice = () => {
      setLessonAchievementID(selectedAchievementID);
      handleClose(); 
    }

    return (
        <div>
            <Button variant="primary"  size="sm" style={{margin: '5px'}} onClick={handleShow}>
                Achievement hinzufügen/ändern
            </Button>
          <Modal show={show} size="lg" fullscreen={true}  onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>Achievement wählen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Wählen Sie das Achievemnet für -{lessonTitle}-</p>
              <AchievementList onSelection={handleSelection}></AchievementList>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Abbrechen
              </Button>
              <Button variant="primary" onClick={confirmChoice}>
                Bestätigen
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
}

export default AddAchievementPopup;