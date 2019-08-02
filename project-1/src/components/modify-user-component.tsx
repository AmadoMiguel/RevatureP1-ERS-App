import React from 'react';
import { Col, Container, Row, Input } from 'reactstrap';

export class ModifyPersonComponent extends React.Component<any,any> {
    constructor(props:any) {
        // Fill in the parent properties with child ones
        super(props);
        this.state ={
            firstName:this.props.firstName,
            lastName:this.props.lastName,
            username:this.props.username,
            email:this.props.email,
            role:this.props.role,
            infoUpdated:false
        }
    }
    
    handleNewUserInfoChange = (event:any) => {
        this.setState({
            [event.target.name]:event.target.value,
            infoUpdated:false
        })
    };
    handleUserInfoUpdateClick() {
        this.props.handle(this.state);
        this.setState({
            infoUpdated:true
        });
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
                </Container>
                <Container>
                    <Row>
                        <Col xs="4" sm='6' md='5' xl='6'><strong>F. Name</strong></Col> 
                        <Col xs="8" sm='6' md='7' xl='6'>
                            <Input
                                name="firstName"
                                className="user-info-input"
                                onChange={(e)=>this.handleNewUserInfoChange(e)}
                                defaultValue={this.props.firstName}
                            />
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col xs="4" sm='6' md='5' xl='6'><strong>L. Name</strong></Col> 
                        <Col xs="8" sm='6' md='7' xl='6'>
                            <Input
                                name="lastName"
                                className="user-info-input"
                                onChange={(e)=>this.handleNewUserInfoChange(e)}
                                defaultValue={this.props.lastName}
                            />
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col xs="4" sm='6' md='5' xl='6'><strong>User</strong></Col> 
                        <Col xs="8" sm='6' md='7' xl='6'>
                            <Input
                                name="username"
                                className="user-info-input"
                                onChange={(e)=>this.handleNewUserInfoChange(e)}
                                defaultValue={this.props.username}
                            />
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col xs="4" sm='6' md='5' xl='6'><strong>Email</strong></Col> 
                        <Col xs="8" sm='6' md='7' xl='6'>
                            <Input
                                name="email"
                                className="user-info-input"
                                onChange={(e)=>this.handleNewUserInfoChange(e)}
                                defaultValue={this.props.email}
                            />
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col xs="4" sm='6' md='5' xl='6'><strong>Role</strong></Col> 
                        <Col xs="8" sm='6' md='7' xl='6'>
                            <Input
                                name="role"
                                className="user-info-input"
                                onChange={(e)=>this.handleNewUserInfoChange(e)}
                                defaultValue={this.props.role}
                            />
                        </Col>
                    </Row>
                    {
                        this.state.infoUpdated 
                        ||
                        <div>
                            <Row>
                                <Col></Col>
                                <Col xs="8" sm='6' md='6' xl='6'>
                                    <button 
                                        id="confirm-user-update"
                                        onClick={()=>{this.handleUserInfoUpdateClick()}}>
                                        confirm changes</button>
                                </Col>
                            </Row>
                        </div>
                    }
                </Container>
            </div>
        );
    }
}