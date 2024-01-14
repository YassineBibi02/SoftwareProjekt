import React, { useEffect, useState, useContext } from 'react';
import { useCookies } from 'react-cookie';
import AchievementEntry from './AchievementEntry';
import '../../AchievementsPage/AchievementDisplay.css';


/**
 * Renders a list of achievements.
 *
 * @param {Function} onSelection - The callback function for when an achievement is selected.
 * @returns {JSX.Element} The rendered component.
 */
const AchievementList = ({onSelection}) => {
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const [achievements, setAchievements] = useState([]);

    // Fetches the achievements from the server
    useEffect(() => {
        fetch('/api/methode/GetAllAchievements', { credentials: 'include' }) // <.>
            .then(response => response.text())
            .then(body => {
                setAchievements(JSON.parse(body));
            });
    }, []);

    // Renders the list of achievements
    return (
        <div style={{ display: 'flex' }}>
            {achievements.map(achievement => (
                <AchievementEntry key={achievement.id} achievementData={achievement} onSelection={onSelection}/>
            ))}
        </div>
    );
};

export default AchievementList;