import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Achievement from './Achievement'; // Import the separate Achievement component
import './AchievementDisplay.css';

const CreateAchievement = () => {
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState([]);
    const [modal, setModal] = useState(false);
    const [newAchievement, setNewAchievement] = useState({ name: '', description: '' });
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const [editModal, setEditModal] = useState(false);
    const [editAchievementData, setEditAchievementData] = useState({ id: '', name: '', description: '' });


    useEffect(() => {
        getAchievements();
    }, []);

    function getAchievements () {
    console.log("test");
        fetch('/api/methode/GetAllAchievements')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAchievements(data);
                }
            })
            .catch(error => {
                console.error('Error fetching achievements:', error);
                setAchievements([]); // Ensure it's always an array
            });
    }

    const toggleModal = () => setModal(!modal);

    const handleEdit = (achievement) => {
        setEditAchievementData(achievement);
        setEditModal(true);
    };

    const handleEditAchievement = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] // Your CSRF token handling may differ
            },
            body: JSON.stringify([editAchievementData.id ,editAchievementData.name, editAchievementData.description])
        };

        const id = editAchievementData.id; // The ID to pass as a request parameter
        fetch('api/methode/EditAchievement', requestOptions)
            .then(response => response.text())
            .then(() => {
                // Handle success
                setEditModal(false);
                getAchievements();
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    };

    const handleAddAchievement = () => {
        fetch('/api/methode/CreateAchievement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
            },
            body: JSON.stringify([newAchievement.name, newAchievement.description])
        })
        .then(response => response.text())
        .then(() => {
             setAchievements(prevAchievements => [...prevAchievements, newAchievement]);
            // Reset the form and close the modal
            setNewAchievement({ name: '', description: '' });
            getAchievements();
        });
        toggleModal();


    };

    const handleDeleteAchievement = (achievementId) => {
        fetch('/api/methode/DeleteAchievement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
            },
            body: JSON.stringify(achievementId)
        })
        .then(response => response.text())
        .then(() => {
            setAchievements(achievements.filter(achievement => achievement.id !== achievementId));
            getAchievements();
        });

    };

    return (
        <div>
            <Header/>
            <div className="achievement-page-container">
            <h1 className="achievements-title">Achievements</h1>
            <div className="achievements-container2">
                {achievements.map(achievement => (
                    <Achievement
                        key={achievement.id}
                        achievement={achievement}
                        onDelete={handleDeleteAchievement}
                        onEdit={handleEdit}
                    />
                ))}
                <div className="add-new" onClick={toggleModal}>
                    <p>+</p>
                </div>
            </div>
            </div>
            {/* Modal for adding new achievement */}
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Add New Achievement</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="achievementName">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="achievementName"
                            placeholder="Enter name"
                            onChange={e => setNewAchievement({ ...newAchievement, name: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="achievementDescription">Description</Label>
                        <Input
                            type="textarea"
                            name="description"
                            id="achievementDescription"
                            placeholder="Enter description"
                            onChange={e => setNewAchievement({ ...newAchievement, description: e.target.value })}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAddAchievement}>Add Achievement</Button>{' '}
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
                <ModalHeader toggle={() => setEditModal(!editModal)}>Edit Achievement</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="achievementName">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="achievementName"
                            placeholder="Enter name"
                            value={editAchievementData.name}
                            onChange={e => setEditAchievementData({ ...editAchievementData, name: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="achievementDescription">Description</Label>
                        <Input
                            type="textarea"
                            name="description"
                            id="achievementDescription"
                            placeholder="Enter description"
                            value={editAchievementData.description}
                            onChange={e => setEditAchievementData({ ...editAchievementData, description: e.target.value })}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => handleEditAchievement(editAchievementData)}>Save Changes</Button>{' '}
                    <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
export default CreateAchievement;