import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import Container from 'react-bootstrap/Container';
import { Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

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
        padding: '5px',
    };

    const [loadedUsers, setLoadedUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/GetUsers');
                console.log('Raw data: ', response.data)
                setLoadedUsers(response.data);
                console.log('Array: ' , loadedUsers);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, []);

    const users = ["Max Mustermann1", "Max Mustermann2", "Max Mustermann3", "Max Mustermann4", "Max Mustermann5", "Max Mustermann6", "Max Mustermann7", "Max Mustermann8", "Max Mustermann9", "Max Mustermann10", "Max Mustermann11", "Max Mustermann12", "Max Mustermann13", "Max Mustermann14"
, "Max Mustermann1", "Max Mustermann2", "Max Mustermann3", "Max Mustermann4", "Max Mustermann5", "Max Mustermann6", "Max Mustermann7", "Max Mustermann8", "Max Mustermann9", "Max Mustermann10", "Max Mustermann11", "Max Mustermann12", "Max Mustermann13", "Max Mustermann14"];

    

    
    return (
        <div>
            <div style={ListStyle}>
                <Container fluid="true" style={{ height: '600px', width: '100%'}}>
                    <Row>
                        {loadedUsers.map((user, index) => (
                            <Col key={index} xs={6} sm={6} md={6} lg={2} style={{marginBottom: '5px'}}>
                                <UserCard userData={user} onSelect={onUserCardSelect} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

        </div>
    );
};

export default UserList;

