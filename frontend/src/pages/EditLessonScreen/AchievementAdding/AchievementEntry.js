/**
 * Represents a single achievement entry component.
 * @param {Object} achievementData - The data of the achievement.
 * @param {Function} onSelection - The function to call when the achievement is selected.
 * @returns {JSX.Element} The rendered achievement entry component.
 */
import React from 'react';
import '../../AchievementsPage/AchievementDisplay.css';

const AchievementEntry = ({ achievementData, onSelection }) => {
    const [background, setBackground] = React.useState("#f7f7f7"); // background color of the achievement entry

    const handleClick = () => {
        onSelection(achievementData.id);
    };
    
    
    return (
        <div className="achievement3" style={{ background, cursor: 'pointer' }} onClick={handleClick} id={achievementData.id}>
            <div className="achievement-image-container">
                <img src="path_to_icon" alt="" className="achievement-icon" />
            </div>
            <div className="achievement-text">
                <h2>{achievementData.name}</h2>
                <p>{achievementData.description}</p>
            </div>
        </div>
    );
};

export default AchievementEntry;
