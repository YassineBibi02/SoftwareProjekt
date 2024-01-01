import React from 'react';
import './TemplateComponent.css'; // Import the CSS file

const TemplateComponent = ({ template, onDelete }) => {
  return (
    <div className="template-card">
      <h3>{template.subject} {template.id}</h3>
      <p>Text: {template.text}</p>
      {/* Add other user information here */}
      <div className="template-actions">
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TemplateComponent;