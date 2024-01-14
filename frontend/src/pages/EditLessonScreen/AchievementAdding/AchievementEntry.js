/**
 * Represents a single achievement entry component.
 * @param {Object} achievementData - The data of the achievement.
 * @param {Function} onSelection - The function to call when the achievement is selected.
 * @returns {JSX.Element} The rendered achievement entry component.
 */
import React from 'react';
import '../../AchievementsPage/AchievementDisplay.css';
import userIcon from '../../../images/user.png';
import medalG from '../../../images/medalG.png';
import medalS from '../../../images/medalS.png';
import medalC from '../../../images/medalC.png';

const AchievementEntry = ({ achievementData, onSelection }) => {
    const [background, setBackground] = React.useState("#f7f7f7"); // background color of the achievement entry

    const handleClick = () => {
        onSelection(achievementData.id);
    };


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
        <div className="achievement3" style={{ background, cursor: 'pointer' }} onClick={handleClick} id={achievementData.id}>
            <div className="achievement-image-container">
                <img src={getMedalImage(achievementData.weight)} alt="" className="achievement-icon" />
            </div>
            <div className="achievement-text">
                <h2>{achievementData.name}</h2>
                <p>{achievementData.description}</p>
            </div>
        </div>
    );
};

export default AchievementEntry;
