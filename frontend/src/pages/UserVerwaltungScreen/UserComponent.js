import React from 'react';
import './UserComponent.css'; // Import the CSS file

const UserComponent = ({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <h3>{user._firstname} {user._lastname}</h3>
      <p>Email: {user._email}</p>
      {/* Add other user information here */}
      <div className="user-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default UserComponent;
