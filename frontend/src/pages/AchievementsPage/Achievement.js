import React from 'react';
import { Button } from 'reactstrap';

const Achievement = ({ achievement, onDelete, onEdit }) => {
    return (
        <div className="achievement2">
            <div className="achievement-image-container">
                <img src="path_to_icon" alt="" className="achievement-icon" />
            </div>
            <div className="achievement-text">
                <h2>{achievement.name}</h2>
                <p>{achievement.description}</p>
            </div>
            <div className="achievement-actions">
                <Button className="edit-button" onClick={() => onEdit(achievement)}>Edit</Button>
                <Button className="delete-button" onClick={() => onDelete(achievement.id)}>Delete</Button>
            </div>
        </div>
    );
};

export default Achievement;
