import React from 'react';
import './TemplateComponent.css'; // Import the CSS file

const TemplateComponent = ({ template, onDelete }) => {
  console.log("Template given: " , {template});

  if (template === undefined) {
    return (
      <div className="template-card">
        <h3>No template selected</h3>
      </div>
    );
  }
  return (
    <div className="template-card">
      <h3>Subject: {template[2]}</h3>
      <p>Text: {template[3]}</p>
      <p>Level: {template[1]}</p>
      {/* Add other user information here */}
      <div className="template-actions">
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TemplateComponent;