import React from 'react';
import UserCard from './UserCard';
import Container from 'react-bootstrap/Container';
import { Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';


const UserList = () => {
    const ListStyle = {
        margin: '20px',
        marginRight: '200px',
        padding: '20px',
        fontSize: '1.5em',
        display: 'flex',
        width: '95%',
        height: '100%',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '5px',
        border: '3px solid orange',
        cursor: 'pointer',
        justifyContent: 'space-between',
    };

    const users = ["Max Mustermann1", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2", "Max Mustermann2"];

    return (
        <div style={ListStyle}>
            <h1>Users</h1>
            <Container>
                <Row >
                    {users.map((user, index) => (
                        <Col key={index} xs={12} sm={12} md={6} lg={4}>
                            <UserCard user={user} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default UserList;
  