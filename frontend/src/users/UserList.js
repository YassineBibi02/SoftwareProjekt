import React from 'react';
import UserCard from './UserCard';
import Container from 'react-bootstrap/Container';
import { Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';

const UserList = ({ onUserCardSelect }) => {
    const ListStyle = {
        fontSize: '1em',
        display: 'flex',
        width: '60%',
        height: '100%',
        color: 'black',
        borderRadius: '5px',
        border: '3px solid black',
        justifyContent: 'center',
        overflow: 'scroll',
        margin: '0 auto', 
        float: 'left',
        marginLeft: '40px',
        backgroundColor: 'orange',
    };

    const users = ["Max Mustermann1", "Max Mustermann2", "Max Mustermann3", "Max Mustermann4", "Max Mustermann5", "Max Mustermann6", "Max Mustermann7", "Max Mustermann8", "Max Mustermann9", "Max Mustermann10", "Max Mustermann11", "Max Mustermann12", "Max Mustermann13", "Max Mustermann14"];


    return (
        <div>
            <div style={ListStyle}>
                <Container fluid="true" style={{ height: '600px', width: '100%'}}>
                    <Row>
                        {users.map((user, index) => (
                            <Col key={index} xs={6} sm={6} md={6} lg={2} style={{margin: '1px'}}>
                                <UserCard username={user} onSelect={onUserCardSelect} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

        </div>
    );
};

export default UserList;

