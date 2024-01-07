import React from 'react';
import './TemplateComponent.css'; // Import the CSS file

const TemplateComponent = ({ template, onEdit }) => {
  console.log("Template given: " , {template});

  if (template === undefined) {
    return (
      <div className="template-card">
        <h3>Kein Template gefunden</h3>
      </div>
    );
  }
  return (
    <div className="template-card">
      <h3>Betreff:    {template[2]}</h3>
      <p>Level: {template[1]}</p>
      {/* Add other user information here */}
      <div className="template-actions">
        <button onClick={onEdit}>Bearbeiten</button>
      </div>
    </div>
  );
};

export default TemplateComponent;