import React, { useState } from 'react';
import Header from '../../components/Header';
import LoginContext from '../globals/globalContext';

const AchievementScreenComponent = () => {
    const achievementsData = [
        { id: 1, title: 'First Achievement', description: 'Den ersten Stein gelegt!' },
        { id: 2, title: 'Second Achievement', description: '... und den zweiten gleich noch dazu!' },

    ];

    return (
        <div>
            <Header />
            <div className="achievements-container">
                <h2>Your Achievements</h2>
                <ul>
                    {achievementsData.map((achievement) => (
                        <li key={achievement.id}>
                            <h3>{achievement.title}</h3>
                            <p>{achievement.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AchievementScreenComponent;