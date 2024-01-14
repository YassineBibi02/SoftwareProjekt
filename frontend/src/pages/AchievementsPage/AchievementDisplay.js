import React, { useState, useEffect } from 'react';
import './AchievementDisplay.css';
import userIcon from '../../images/user.png';
import { useCookies } from 'react-cookie';
/**
 * Renders an achievement display component. Used to represent an Achievement without the edit and delete buttons.
 * @param {string} achievementId - The ID of the achievement.
 * @param {string} xsrfToken - The XSRF token used to fetch from the server.
 * @returns {JSX.Element} The rendered achievement display component.
 */
const AchievementDisplay = ({ achievementId, xsrfToken }) => {
    const [achievement, setAchievement] = useState(null);
    const [cookies] = useCookies(['XSRF-TOKEN']); // <.>

    // Fetches the achievement data from the server
    useEffect(() => {
        fetch('/api/methode/AchievementDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] // Pass the XSRF token here if needed
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


