import React from 'react';
import { Col, Container, Row } from 'reactstrap';

// Define the properties of the person component
export interface IPersonProps {
    userId:string,
    firstName:string,
    lastName:string,
    username:string,
    email:string,
    role:string
}

export class PersonComponent extends React.Component<IPersonProps,any> {
    constructor(props:IPersonProps) {
        // Fill in the parent properties with child ones
        super(props);
    }
    render() {
        return (
            // Way to display information for each user
            <div className="person-box-all-users">
                <Container>
                    <Row>
                        <Col><strong>User Id</strong></Col> 
                        <Col>{this.props.userId}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>First Name</strong></Col> 
                        <Col>{this.props.firstName}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>Last Name</strong></Col> 
                        <Col>{this.props.lastName}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>Username</strong></Col> 
                        <Col>{this.props.username}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>Email</strong></Col> 
                        <Col>{this.props.email}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>Role</strong></Col> 
                        <Col>{this.props.role}</Col>
                    </Row>
                </Container>
            </div>
        );
    }
}