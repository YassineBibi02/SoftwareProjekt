
import React from 'react';
import Header from '../../components/Header';
import LessonsList from './LessonsList';
/**
 * Renders the LessonsScreenComponent which includes a Lessons List below the header.
 * @returns {JSX.Element} The rendered component.
 */
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

    

