import React from 'react';
import { Col, Container, Row, Input, Button, Label } from 'reactstrap';

export class ModifyPersonComponent extends React.Component<any,any> {
    constructor(props:any) {
        // Fill in the parent properties with child ones
        super(props);
    }

    render() {
        return (
            // Way to display information for each user. 
            <div className="person-box">
                <Container>
                    <Row>
                        <Col><strong>User Id</strong></Col> 
                        <Col>{this.props.userId}</Col>
                    </Row>
                    <Row>
                        <Col xs="4" sm='6' md='5' xl='6'><strong>F. Name</strong></Col> 
                        <Col xs="8" sm='6' md='7' xl='6'>
                            <Input
                                name="firstName"
                                className="user-info-input"
                                onChange={(e)=>this.props.handle(e)}
                                defaultValue={this.props.firstName}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="4" sm='6' md='5' xl='6'><strong>L. Name</strong></Col> 
                        <Col xs="8" sm='6' md='7' xl='6'>
                            <Input
                                name="lastName"
                                className="user-info-input"
                                onChange={(e)=>this.props.handle(e)}
                                defaultValue={this.props.lastName}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="4" sm='6' md='5' xl='6'><strong>User</strong></Col> 
                        <Col xs="8" sm='6' md='7' xl='6'>
                            <Input
                                name="username"
                                className="user-info-input"
                                onChange={(e)=>this.props.handle(e)}
                                defaultValue={this.props.username}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="4" sm='6' md='5' xl='6'><strong>Email</strong></Col> 
                        <Col xs="8" sm='6' md='7' xl='6'>
                            <Input
                                name="email"
                                className="user-info-input"
                                onChange={(e)=>this.props.handle(e)}
                                defaultValue={this.props.email}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="4" sm='6' md='5' xl='6'><strong>Role</strong></Col> 
                        <Col xs="8" sm='6' md='7' xl='6'>
                            <Input
                                name="role"
                                className="user-info-input"
                                onChange={(e)=>this.props.handle(e)}
                                defaultValue={this.props.role}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Button 
                            id='update-user-button'
                            onClick={()=>this.props.update()}>
                                Update
                        </Button>
                    </Row>
                </Container> 
            </div>
        );
    }
}