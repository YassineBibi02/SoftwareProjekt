import React, { useState } from 'react';
import Header from '../../components/Header';
import LessonsList from './LessonsList';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const LessonsScreenComponent = () => {

    return (
        <div>
            <Header/>
            <div>
                <LessonsList/>
            </div>
        </div>
    );
};

export default LessonsScreenComponent;

    

