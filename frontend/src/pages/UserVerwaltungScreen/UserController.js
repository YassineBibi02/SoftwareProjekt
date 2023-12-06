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
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
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
    // Perform the edit logic here with the editedUserData
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
            {/* Handle user data changes */}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleEditUser}>
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
