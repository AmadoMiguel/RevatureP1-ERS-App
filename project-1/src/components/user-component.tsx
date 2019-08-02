import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { User } from '../models/user-model';

// Component to display current user information, whose information
// is being stored locally
// This way of displaying user info is only done for the current user
// since is in the login component where the response (with the user info)
// is received
export class CurrentUserComponent extends React.Component <any,any> {
    render () {
        const userJson = localStorage.getItem("Current User");
        const currUser = userJson !== null ? new User(JSON.parse(userJson)) : new User({});
        return (
            // Define container for person information
            // Set responsive display according to size 
            <div className="user-info-container col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4"
            id="user-info-list" style={{listStyleType:"none",background:'rgba(90,190,180,0.6)'}}>
                Your info:
                <Container>
                    <Row key="user-id">
                        <Col><strong>User Id</strong></Col>
                        <Col>{currUser.userId}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row key="first-name">
                        <Col><strong>First Name</strong></Col>
                        <Col>{currUser.firstName}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row key="last-name">
                        <Col><strong>Last Name</strong></Col>
                        <Col>{currUser.lastName}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row key="username">
                        <Col><strong>Username</strong></Col>
                        <Col>{currUser.username}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row key="email">
                        <Col><strong>Email</strong></Col>
                        <Col>{currUser.email}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row key="role">
                        <Col><strong>Role</strong></Col>
                        <Col>{currUser.role}</Col>
                    </Row>
                </Container>
            </div>
        );
    }
}