import React, { useState, useEffect } from 'react';
import './AchievementDisplay.css';
import userIcon from '../../images/user.png';

const AchievementDisplay = ({ achievementId, xsrfToken }) => {
    const [achievement, setAchievement] = useState(null);

    useEffect(() => {
        fetch('/api/methode/AchievementDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': xsrfToken // Pass the XSRF token here if needed
            },
            body: JSON.stringify(achievementId)
        })
        .then(response => response.json())
        .then(data => {
            setAchievement(data);
        })
        .catch(error => console.error('Error fetching achievement:', error));
    }, [achievementId, xsrfToken]);

    if (!achievement) {
        return <div>Loading...</div>;
    }

    return (
        <div className="achievement">
            <div className="achievement-image-container">
                <img src={userIcon} alt="User Icon" className="achievement-ico"/>
            </div>
            <div className="achievement-text">
                <h2>{achievement.name}</h2>
                <p>{achievement.description}</p>
            </div>
        </div>
    );
}

export default AchievementDisplay;


