import React from 'react';
import './TemplateComponent.css'; // Import the CSS file

const TemplateComponent = ({ template, onDelete }) => {
  return (
    <div className="template-card">
      <h3>Subject:</h3>
      <p>Text:</p>
      <p>Level:</p>
      {/* Add other user information here */}
      <div className="template-actions">
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TemplateComponent;