import React, { useEffect, useContext, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { useCookies } from 'react-cookie';
import Header from '../../components/Header';
import LoginContext from '../../globals/globalContext';
import TemplateComponent from './TemplateComponent';
import { useNavigate } from 'react-router-dom';
import './TemplateControl.css';

const UserController = () => {
  const [cookies] = useCookies(['XSRF-TOKEN']);
  const { isLoggedIn, setLoggedIn, userV, setUserV } = useContext(LoginContext);
  const navigate = useNavigate();
  // User data and edit state
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch all templates when the component mounts
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

  }

  // Handle deleting a template
  const handleDelete = (template) => {
    /*
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
    */
  };

  // Handle confirming a template deletion
  const handleConfirmDelete = () => {
    // Perform the deletion logic here
    // Close the delete confirmation modal
    /*
    setIsDeleteModalOpen(false);
    */
  };

  // Handle closing modals
  const handleCloseModals = () => {
    /*
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    */
  };

  return (
    <div>
      <Header />
      <div className="MainBox">
        <h2 className="Welcome">Templates</h2>
        <div className="template-grid">
          {templates.map((template) => (
            <UserComponent
              template={template}
              onEdit={() => handleEdit(template)}
              onDelete={() => handleDelete(template)}
            />
          ))}
        </div>
      </div>

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

export default TemplateController;