import React from 'react';
import UserCard from './UserCard';
import Container from 'react-bootstrap/Container';
import { Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';

const UserList = () => {
    const ListStyle = {
        fontSize: '1.5em',
        display: 'flex',
        width: '90%',
        height: '100%',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '5px',
        border: '3px solid orange',
        cursor: 'pointer',
        justifyContent: 'space-between',
        overflow: 'scroll',
        margin: '0 auto', // Add this line to center the UserList horizontally
    };

    const users = ["Max Mustermann1", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2"];

    return (
        <div style={ListStyle}>
            <Container style={{ height: '600px', width: '100%'}}>
                <Row>
                    {users.map((user, index) => (
                        <Col key={index} xs={6} sm={6} md={6} lg={3}>
                            <UserCard user={user} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default UserList;

