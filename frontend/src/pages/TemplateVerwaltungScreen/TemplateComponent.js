import React from 'react';
import './TemplateComponent.css'; // Import the CSS file

const TemplateComponent = ({ user, onEdit, onDelete }) => {
  return (
    <div className="template-card">
      <h3>{user._firstname} {user._lastname}</h3>
      <p>Email: {user._email}</p>
      {/* Add other user information here */}
      <div className="template-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TemplateComponent;