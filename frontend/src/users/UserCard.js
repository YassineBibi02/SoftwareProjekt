import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";


const UserCard = () =>  {
    
    const CardStyle = {
        margin: '20px',
        marginRight: '200px',
        padding: '20px',
        fontSize: '1.5em',
        display : 'flex',
        width: '100%',  
        height: '100%',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '5px',
        border: '3px solid orange',
        cursor: 'pointer',
        justifyContent: 'space-between',
        };
    
        const CheckmarkStyle = {
            size: 1000,
        };

  return (
    <Card style={CardStyle}>
      <Card.Body>
        <Form>
            <div key="custom-checkbox">
                <Form.Check custom type="checkbox" id="SelectionBox" label="" style={CheckmarkStyle} size={1000}/>
            </div>
        </Form>
        <Card.Title>Max Mustermann</Card.Title>
        <Card.Text>
            Current Level: 1
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default UserCard;