import React, { useEffect, useContext, useState } from 'react';
import { Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { useCookies } from 'react-cookie';
import Header from '../../components/Header';
import LoginContext from '../../globals/globalContext';
import UserComponent from './UserComponent'; // Import your User Component
import './UserControl.css';

const UserController = () => {
  const [cookies] = useCookies(['XSRF-TOKEN']);
  const { isLoggedIn, setLoggedIn, userV, setUserV } = useContext(LoginContext);

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

  // Fetch all users when the component mounts
  useEffect(() => {
    fetch('/api/methode/GetUsers', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
      },
    })
      .then((response) => response.json()) // Parse JSON response
      .then((data) => setUsers(data.map(JSON.parse))) // Parse each user object
      .catch((error) => console.error('Error fetching users:', error));
      console.log(users);
  }, []);

  // Functions to handle edit and delete
  // Function to initialize the editedUserData when the "Edit" button is clicked
    const handleEdit = (user) => {
      setSelectedUser(user);
      setIsEditModalOpen(true);
        console.log(user);
      // Initialize editedUserData with the values of the selected user
      setEditedUserData({
        _firstname: user._firstname,
        _lastname: user._lastname,
        _email: user._email,
        _maillevel: user._maillevel,
        _id: user._ID, // Assign user._id to _id in editedUserData
        // Initialize other fields as needed
      });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserData({
          ...editedUserData,
          [name]: value,
        });
    };
  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Perform the deletion logic here
    // Close the delete confirmation modal
    setIsDeleteModalOpen(false);
  };

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
    console.log(JSON.stringify(payload))    ;
    // Make a POST request to your backend API
    fetch('/api/methode/EditUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
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

  const handleCloseModals = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <Header />
      <div className="MainBox">
        <h2 className="Welcome">Users</h2>
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
      <ModalHeader>Edit User</ModalHeader>
      <ModalBody>
        <Form>
          {/* Populate the form with selectedUser data */}
          <FormGroup>
            <Label for="_firstname">First Name</Label>
            <Input
              type="text"
              name="_firstname"
              id="_firstname"
              value={editedUserData._firstname}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="_lastname">Last Name</Label>
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
          Save
        </Button>
        <Button color="secondary" onClick={handleCloseModals}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={handleCloseModals}>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody>Are you sure you want to delete this user?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserController;
