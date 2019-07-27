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

export class ModifyPersonComponent extends React.Component<IPersonProps,any> {
    constructor(props:IPersonProps) {
        // Fill in the parent properties with child ones
        super(props);
        this.state ={

        }
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
                        <Col><strong>F. Name</strong></Col> 
                        <Col xs="8" sm='6' md='6' xl='6'>
                            <input type="text" className="user-info-input" 
                            placeholder={this.props.firstName}/> 
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>L. Name</strong></Col> 
                        <Col xs="8" sm='6' md='6' xl='6'>
                            <input type="text" className="user-info-input" placeholder={this.props.lastName}/>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>Username</strong></Col> 
                        <Col xs="8" sm='6' md='6' xl='6'>
                            <input type="text" className="user-info-input" placeholder={this.props.username}/>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>Email</strong></Col> 
                        <Col xs="8" sm='6' md='6' xl='6'>
                            <input type="text" className="user-info-input" placeholder={this.props.email}/>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col><strong>Role</strong></Col> 
                        <Col xs="8" sm='6' md='6' xl='6'>
                            <input type="text" className="user-info-input" placeholder={this.props.role}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}