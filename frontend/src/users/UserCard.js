import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";


const UserCard = ({ username, onSelect }) => {
  const CardStyle = {
    margin: '10px',
    padding: '3px',
    fontSize: '0.9em',
    display: 'flex',
    width: '110%',
    height: '100%',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: '3px',
    border: '3px solid black',
    justifyContent: 'space-between',
  };

  const CheckmarkStyle = {
    size: 1000,
  };

  const name = username;

  return (
    <Card style={CardStyle} name={username}>
      <Card.Body>
        <Form>
          <div key="custom-checkbox">
            <Form.Check
              type="checkbox"
              id="SelectionBox"
              label=""
              style={CheckmarkStyle}
              size={1}
              name={username}
              onChange={onSelect}
            />
          </div>
        </Form>
        <Card.Title style={{ fontSize: '1rem' }}>{username}</Card.Title>
        <Card.Text>Aktuelles Level: 1</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default UserCard;