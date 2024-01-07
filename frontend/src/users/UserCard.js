import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from "react-bootstrap/Form";


const UserCard = ({ userData, onSelect }) => {
  const CardStyle = {
    margin: '1px',
    padding: '3px',
    fontSize: '0.9em',
    display: 'flex',
    width: '100%',
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

  const jsonData = JSON.parse(userData);

  return (
    <Card style={CardStyle} firstname={jsonData._firstname} lastname={jsonData._lastname} mail={jsonData._EMail} id={jsonData._ID} name={jsonData._firstname + " " + jsonData._lastname}>
      <Card.Body>
        <Form>
          <div key="custom-checkbox">
            <Form.Check
              type="checkbox"
              id="SelectionBox"
              label=""
              style={CheckmarkStyle}
              size={1}
              firstname={jsonData._firstname}
              lastname={jsonData._lastname}
              onChange={onSelect}
            />
          </div>
        </Form>
        <Card.Title style={{ fontSize: '1rem' }}>{jsonData._firstname} {jsonData._lastname}</Card.Title>
        <Card.Text>Aktuelles Level: {jsonData._maillevel}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default UserCard;