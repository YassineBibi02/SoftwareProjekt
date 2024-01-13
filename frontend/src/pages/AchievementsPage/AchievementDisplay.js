import React, { useState, useEffect } from 'react';
import './AchievementDisplay.css';
import userIcon from '../../images/user.png';
import medalG from '../../images/medalG.png';
import medalS from '../../images/medalS.png';
import medalC from '../../images/medalC.png';

import { useCookies } from 'react-cookie';

const AchievementDisplay = ({ achievementId, xsrfToken }) => {
    const [achievement, setAchievement] = useState(null);
    const [cookies] = useCookies(['XSRF-TOKEN']); // <.>


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

// Function to select medal based on weight
    const getMedalImage = (weight) => {
        switch(weight) {
            case 3: return medalG;
            case 2: return medalS;
            case 1: return medalC;
            default: return medalC;
        }
    };

    return (
        <div className="achievement">
            <div className="achievement-image-container">
                <img src={getMedalImage(achievement.weight)} alt="Medal" className="achievement-icon"/>
            </div>
            <div className="achievement-text">
                <h2>{achievement.name}</h2>
                <p>{achievement.description}</p>
            </div>
        </div>
    );
}

export default AchievementDisplay;

