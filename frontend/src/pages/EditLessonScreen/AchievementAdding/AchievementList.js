import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import React, { useEffect, useState, useContext } from 'react';
import { MdDelete } from "react-icons/md";
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';
import AchievementEntry from './AchievementEntry';
import '../../AchievementsPage/AchievementDisplay.css';

const AchievementList = ({onSelection}) => {
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        fetch('/api/methode/GetAllAchievements', { credentials: 'include' }) // <.>
            .then(response => response.text())
            .then(body => {
                setAchievements(JSON.parse(body));
            });
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            {achievements.map(achievement => (
                <AchievementEntry key={achievement.id} achievementData={achievement} onSelection={onSelection}/>
            ))}
        </div>
    );
};

export default AchievementList;