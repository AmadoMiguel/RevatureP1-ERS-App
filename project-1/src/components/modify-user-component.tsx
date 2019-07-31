import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { TextField } from 'material-ui';
import { MuiThemeProvider } from 'material-ui/styles';

export class ModifyPersonComponent extends React.Component<any,any> {
    constructor(props:any) {
        // Fill in the parent properties with child ones
        super(props);
        this.state ={
            firstName:this.props.firstName,
            lastName:this.props.lastName,
            username:this.props.username,
            email:this.props.email,
            role:this.props.role
        }
    }
    
    handleNewUserInfoChange = (event:any) => {
        this.setState({[event.target.name]:event.target.value})
    };

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
                        <Col><strong>F. Name</strong></Col> 
                        <Col xs="8" sm='6' md='6' xl='6'>
                        <MuiThemeProvider>
                            <TextField
                                name="firstName"
                                className="user-info-input"
                                style={{width:"auto",fontSize:"2.5vh",
                                        height:"5.7vh"}}
                                onChange={(e)=>this.handleNewUserInfoChange(e)}
                                placeholder={this.props.firstName}
                            />
                        </MuiThemeProvider>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>L. Name</strong></Col> 
                        <Col xs="8" sm='6' md='6' xl='6'>
                        <MuiThemeProvider>
                            <TextField
                                name="lastName"
                                className="user-info-input"
                                style={{width:"auto",fontSize:"2.5vh",
                                        height:"5.7vh"}}
                                onChange={(e)=>this.handleNewUserInfoChange(e)}
                                placeholder={this.props.lastName}
                            />
                        </MuiThemeProvider>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>Username</strong></Col> 
                        <Col xs="8" sm='6' md='6' xl='6'>
                        <MuiThemeProvider>
                            <TextField
                                name="username"
                                className="user-info-input"
                                style={{width:"auto",fontSize:"2.5vh",
                                        height:"5.7vh"}}
                                onChange={(e)=>this.handleNewUserInfoChange(e)}
                                placeholder={this.props.username}
                            />
                        </MuiThemeProvider>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>Email</strong></Col> 
                        <Col xs="8" sm='6' md='6' xl='6'>
                        <MuiThemeProvider>
                            <TextField
                                name="email"
                                className="user-info-input"
                                style={{width:"auto",fontSize:"2.5vh",
                                        height:"5.7vh"}}
                                onChange={(e)=>this.handleNewUserInfoChange(e)}
                                placeholder={this.props.email}
                            />
                        </MuiThemeProvider>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>Role</strong></Col> 
                        <Col xs="8" sm='6' md='6' xl='6'>
                        <MuiThemeProvider>
                            <TextField
                                name="role"
                                className="user-info-input"
                                style={{width:"auto",fontSize:"2.5vh",
                                        height:"5.7vh"}}
                                onChange={(e)=>this.handleNewUserInfoChange(e)}
                                placeholder={this.props.role}
                            />
                        </MuiThemeProvider>
                        </Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col>
                            <button 
                                onClick={()=>this.props.handle(this.state)}>
                                confirm changes</button>
                        </Col>
                    </Row>
                    
                </Container>
                
            </div>
        );
    }
}