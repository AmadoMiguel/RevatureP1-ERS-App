import React from 'react';
import { Container, Row, Col } from 'reactstrap';

// Component to display current user information, whose information
// is being stored locally
// This way of displaying user info is only done for the current user
// since is in the login component where the response (with the user info)
// is received
export class CurrentUserComponent extends React.Component <any,any> {
    render () {
        return (
            // Define container for person information
            // Set responsive display according to size 
            <div className="user-info-container col-9 col-sm-6 col-md-4 col-lg-6 col-xl-3"
            id="user-info-list" style={{listStyleType:"none",background:'rgba(90,190,180,0.6)'}}>
                Your info:
                <Container>
                    <Row key="user-id">
                        <Col><strong>User Id</strong></Col>
                        <Col>{localStorage.getItem("User ID")}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row key="first-name">
                        <Col><strong>First Name</strong></Col>
                        <Col>{localStorage.getItem("First name")}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row key="last-name">
                        <Col><strong>Last Name</strong></Col>
                        <Col>{localStorage.getItem("Last name")}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row key="username">
                        <Col><strong>Username</strong></Col>
                        <Col>{localStorage.getItem("username")}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row key="email">
                        <Col><strong>Email</strong></Col>
                        <Col>{localStorage.getItem("email")}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row key="role">
                        <Col><strong>Role</strong></Col>
                        <Col>{localStorage.getItem("Role")}</Col>
                    </Row>
                </Container>
            </div>
        );
    }
}