import React, { useEffect, useContext, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { useCookies } from 'react-cookie';
import Header from '../../components/Header';
import LoginContext from '../../globals/globalContext';
import UserComponent from './UserComponent'; // Import your User Component
import { useNavigate } from 'react-router-dom';
import './UserControl.css';

const UserController = () => {
  const [cookies] = useCookies(['XSRF-TOKEN']);
  const { isLoggedIn, setLoggedIn, userV, setUserV } = useContext(LoginContext);
  const navigate = useNavigate();
  // User data and edit state
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    _id: '',
    _firstname: '',
    _lastname: '',
    _email: '',
    _maillevel: '',
  });

  const [assignPopup, setAssignPopup] = useState(false);
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // Fetch all users when the component mounts
  useEffect(() => {
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
                      Initialize();
                  }
              }
          });


  }, []);

  function Initialize () {
      // Fetch users
      fetch('/api/methode/GetUsers', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
        },
      })
        .then((response) => response.json())
        .then((data) => setUsers(data.map(JSON.parse)))
        .catch((error) => console.error('Error fetching users:', error));

      // Fetch achievements
    fetch('/api/methode/GetAllAchievements')
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data)) {
                setAchievements(data);
            }
        })
        .catch((error) => {
            console.error('Error fetching achievements:', error);
            setAchievements([]); // Ensure it's always an array
    });

  }

  // Toggle the assignment popup
  const toggleAssignPopup = () => setAssignPopup(!assignPopup);

  // Handle editing a user
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);

    // Initialize editedUserData with the values of the selected user
    setEditedUserData({
      _firstname: user._firstname,
      _lastname: user._lastname,
      _email: user._email,
      _maillevel: user._maillevel,
      _id: user._ID,
      // Initialize other fields as needed
    });
  };

  // Handle selecting/deselecting achievements
  const handleAchievementSelection = (e, achievementId) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedAchievements((prevSelected) => [...prevSelected, achievementId]);
    } else {
      setSelectedAchievements((prevSelected) =>
        prevSelected.filter((id) => id !== achievementId)
      );
    }
  };

  // Handle assigning achievements
  const handleAssignAchievements = () => {
    // Perform the achievement assignment logic here using the selectedAchievements array
    console.log('Selected Achievements:', selectedAchievements);

    // Convert selectedAchievements to an array of strings
    const selectedAchievementIDs = selectedAchievements.map((achievementId) => achievementId.toString());

    // Make a POST request to your API to add bulk achievements
    fetch('/api/methode/AddBulkAchievement', {
      method: 'POST',
      headers: {
       'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([editedUserData._id, selectedAchievementIDs.join(',')]),
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Failed to assign achievements');
        }
      })
      .then((data) => {
        console.log('Added Achievement IDs:', data);
        // Handle the added achievement IDs here as needed
      })
      .catch((error) => {
        console.error('Error assigning achievements:', error);
      });

    // Close the assignment popup
    toggleAssignPopup();
  };


  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({
      ...editedUserData,
      [name]: value,
    });
  };

  // Handle deleting a user
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle confirming user deletion
  const handleConfirmDelete = () => {
    if (selectedUser) {
      // Prepare the email to be sent in the request body
      const requestBody = JSON.stringify([selectedUser._email]);

      fetch('/api/methode/RemoveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
        },
        body: requestBody,
      })
        .then((response) => {
          if (response.ok) {
            // User deleted successfully
            console.log('User removed successfully');
            // Optionally, update the users state to reflect the change
            setUsers(users.filter((user) => user._email !== selectedUser._email));
          } else {
            // Handle the case where the request was not successful
            console.error('Failed to remove user');
          }
        })
        .catch((error) => {
          // Handle network or other errors here
          console.error('Error removing user:', error);
        });
    }
    // Close the delete confirmation modal
    setIsDeleteModalOpen(false);
  };

  // Handle editing a user's data
  const handleEditUser = (editedUserData) => {
    console.log(editedUserData);
    // Create a JSON payload with the updated user data
    const payload = [
      editedUserData._id,
      editedUserData._firstname,
      editedUserData._lastname,
      editedUserData._email,
      editedUserData._maillevel.toString(),
    ];

    // Make a POST request to your backend API to edit the user
    fetch('/api/methode/EditUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          // User edited successfully
          // You can handle success actions here (e.g., updating the user list)
          console.log('User edited successfully');
        } else {
          // Handle the case where the request was not successful
          console.error('Failed to edit user');
        }
      })
      .catch((error) => {
        // Handle network or other errors here
        console.error('Error editing user:', error);
      });

    // Close the edit modal
    setIsEditModalOpen(false);
  };

  // Handle closing modals
  const handleCloseModals = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <Header />
      <div className="MainBox">
        <h2 className="Welcome">Nutzer</h2>
        <div className="user-grid">
          {users.map((user) => (
            <UserComponent
              key={user._ID}
              user={user}
              onEdit={() => handleEdit(user)}
              onDelete={() => handleDelete(user)}
            />
          ))}
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal isOpen={isEditModalOpen} toggle={handleCloseModals}>
        <ModalHeader>Nutzer bearbeiten</ModalHeader>
        <ModalBody>
          <Form>
            {/* Populate the form with selectedUser data */}
            <FormGroup>
              <Label for="_firstname">Vorname</Label>
              <Input
                type="text"
                name="_firstname"
                id="_firstname"
                value={editedUserData._firstname}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="_lastname">Nachname</Label>
              <Input
                type="text"
                name="_lastname"
                id="_lastname"
                value={editedUserData._lastname}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="_email">Email</Label>
              <Input
                type="email"
                name="_email"
                id="_email"
                value={editedUserData._email}
                onChange={handleInputChange}
              />
            </FormGroup>
            {/* Add other input fields as needed */}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleEditUser(editedUserData)}>
            Speichern
          </Button>
          <Button color="secondary" onClick={() => setIsEditModalOpen(false)}>
            Abbrechen
          </Button>
          <Button color="info" onClick={toggleAssignPopup}>
            Achievement zuweisen
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={handleCloseModals}>
        <ModalHeader>Löschen bestätigen</ModalHeader>
        <ModalBody>Möchten Sie diesen Benutzer wirklich löschen</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirmDelete}>
            Löschen
          </Button>
          <Button color="secondary" onClick={handleCloseModals}>
            Abbrechen
          </Button>
        </ModalFooter>
      </Modal>

      {/* Assign Achievement Modal */}
      <Modal isOpen={assignPopup} toggle={toggleAssignPopup}>
        <ModalHeader toggle={toggleAssignPopup}>Achievement zuweisen</ModalHeader>
        <ModalBody>
          {/* Fetch the list of achievements here and display them */}
          {achievements.map((achievement) => (
            <div key={achievement.id}>
              <input
                type="checkbox"
                value={achievement.id}
                onChange={(e) => handleAchievementSelection(e, achievement.id)}
                checked={selectedAchievements.includes(achievement.id)}
              />
              {achievement.name}
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAssignAchievements}>
            Zuweisen
          </Button>
          <Button color="secondary" onClick={toggleAssignPopup}>
            Abbrechen
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserController;
