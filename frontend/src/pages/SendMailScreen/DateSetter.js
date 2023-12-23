import React from 'react';
import Form from "react-bootstrap/Form";
import { useState } from "react";

const DateSetter = ({ title, setDateParent }) => { 

    const [date, setDate] = useState(new Date());

    const ContainerStyle = {
        margin: '20px',
    };

    const TextStyle = {
        fontSize: '1.5em',
    };

    const updateDate = (e) => {
        setDate(e);
        setDateParent(e);
    };

    return (
        <div style={ContainerStyle}>
            <h1 style={TextStyle}>{title}</h1>
            <Form.Control
                style={{width: '100%'}}  
                type="date"
                name="datepic"
                placeholder="DateRange"
                value={date}
                onChange={(e) => updateDate(e.target.value)}
                width={100}
              />
        </div>
    );
}

export default DateSetter;