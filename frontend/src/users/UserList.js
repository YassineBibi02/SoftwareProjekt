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
        border: '3px solid #ec6608',
        justifyContent: 'center',
        overflow: 'scroll',
        margin: '0 auto', 
        float: 'left',
        marginLeft: '40px',
        backgroundColor: 'lightgrey',
        padding: '5px',
    };

    const [loadedUsers, setLoadedUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/methode/GetUsers');
                console.log('Raw data: ', response.data)
                setLoadedUsers(response.data);
                console.log('Array: ' , loadedUsers);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, []);


    
    return (
        <div>
            <div style={ListStyle}>
                <Container fluid style={{ height: '600px', width: '100%'}}>
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

