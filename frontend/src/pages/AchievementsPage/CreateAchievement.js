
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Achievement from './Achievement'; // Import the separate Achievement component
import './AchievementDisplay.css';
/**
 * Component for creating achievements.
 * 
 * @returns {JSX.Element} The CreateAchievement component.
 */
const CreateAchievement = () => {
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState([]);
    const [modal, setModal] = useState(false);
    const [newAchievement, setNewAchievement] = useState({ name: '', description: '', weight: 0 });
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const [editModal, setEditModal] = useState(false);
    const [editAchievementData, setEditAchievementData] = useState({ id: '', name: '', description: '' });


    // Fetches the user data from the server, only allowing access to the page if the user has Admin_Access
    useEffect(() => {
        console.log("test")
        fetch('api/user', { credentials: 'include' }) // <.>
            .then(response => response.text())
            .then(body => {
                if (body === '') {
                     navigate('/login');
                } else {
                    const userData = JSON.parse(body);

                    // Check for Admin_Access role

                    if (!userData.roles.includes("Admin_Access")) {
                        console.log("Access Denied. Admin Only Area")
                        // If the user does not have Admin_Access, navigate to the home screen
                        navigate('/');
                    } else {
                        // If the user has Admin_Access, continue with fetching achievements or other admin tasks
                        getAchievements();
                    }
                }
            });

    }, []);

    // Fetches the achievements from the server
    function getAchievements () {
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

    // Sends the edited achievement data to the server
    const handleEditAchievement = () => {
        fetch('api/methode/EditAchievement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
            },
            body: JSON.stringify([
                editAchievementData.id,
                editAchievementData.name,
                editAchievementData.description,
                editAchievementData.weight.toString()
            ])
        })
        .then(response => response.text())
        .then(() => {
            setEditModal(false);
            getAchievements();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    // Sends the new achievement data to the server
    const handleAddAchievement = () => {

        fetch('/api/methode/CreateAchievement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
            },
            body: JSON.stringify([
                newAchievement.name,
                newAchievement.description,
                newAchievement.weight.toString() // Convert weight to string
            ])
        })
        .then(response => response.text())
        .then(() => {
            setAchievements(prevAchievements => [...prevAchievements, newAchievement]);
            // Reset the form and close the modal
            setNewAchievement({ name: '', description: '', weight: 0 });
            getAchievements();
        })
        .catch(error => {
            console.error('Error:', error);
        });
        toggleModal();
    };


    // Sends the achievement ID to the server to delete the achievement
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
                <ModalHeader toggle={toggleModal}>Füge neues Achievement hinzu</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="achievementName">Titel</Label>
                        <Input
                            type="text"
                            name="name"
                            id="achievementName"
                            placeholder="Enter name"
                            onChange={e => setNewAchievement({ ...newAchievement, name: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="achievementDescription">Beschreibung</Label>
                        <Input
                            type="textarea"
                            name="description"
                            id="achievementDescription"
                            placeholder="Enter description"
                            onChange={e => setNewAchievement({ ...newAchievement, description: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="achievementWeight">Gewicht</Label>
                        <Input
                            type="number"
                            name="weight"
                            id="achievementWeight"
                            placeholder="Enter weight"
                            value={newAchievement.weight}
                            onChange={e => setNewAchievement({ ...newAchievement, weight: e.target.value })}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAddAchievement}>Achievement hinzufügen</Button>{' '}
                    <Button color="secondary" onClick={toggleModal}>Abbrechen</Button>
                </ModalFooter>
            </Modal>
            {/* Modal for editing achievement */}
            <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
                <ModalHeader toggle={() => setEditModal(!editModal)}>Achievemet bearbeiten</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="achievementName">Titel</Label>
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
                        <Label for="achievementDescription">Beschreibung</Label>
                        <Input
                            type="textarea"
                            name="description"
                            id="achievementDescription"
                            placeholder="Enter description"
                            value={editAchievementData.description}
                            onChange={e => setEditAchievementData({ ...editAchievementData, description: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="achievementWeight">Gewicht</Label>
                        <Input
                            type="number"
                            name="weight"
                            id="achievementWeight"
                            placeholder="Enter weight"
                            value={editAchievementData.weight}
                            onChange={e => setEditAchievementData({ ...editAchievementData, weight: e.target.value })}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => handleEditAchievement(editAchievementData)}>Speichere Änderungen</Button>{' '}
                    <Button color="secondary" onClick={() => setEditModal(false)}>Abbrechen</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
export default CreateAchievement;