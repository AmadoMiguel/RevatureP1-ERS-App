import React from "react";
import NavigatorMenu from "./navig-component";
import { Container, Row, Col, Input, Button } from "reactstrap";
import { DropDownMenu, MenuItem } from "material-ui";
import { MuiThemeProvider } from "material-ui/styles";
import Axios from "axios";

export class NewReimbursementComponent extends React.Component <any,any> {
    constructor(props:any) {
        super(props);
        this.state ={
            reimbType:1,
            amount:0,
            description:'',
            dateSubmitted:''
        }
    }

    handleNewReimbInfo(e:any) {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    // Handle reimbursement type selector
    handleReimbTypeChange(v:any) {
        this.setState({
            reimbType:v
        })
    }
    // Send post request
    async createNewReimbursement() {
        const reqHeaders={"Authorization":localStorage.getItem('auth-token'),
        "Content-Type": "application/json"};
        const body = {
                amount:this.state.amount,
                description:this.state.description,
                type:this.state.reimbType,
                dateSubmitted:this.state.dateSubmitted
        };
        // Send the request to update user info
        const response = await 
        Axios(
            {method:"POST",
            url:"http://localhost:3006/Reimbursements",
            headers:reqHeaders,
            data:body
            }
        );
        // Handle response status
        switch(response.data.status){
            case 406: // Not acceptable information provided
                alert("Could not create. Please verify information.");
                break;
            case 201:    
                alert("Succesfully created.");
                this.props.history.replace("/reimbursements");
                break;
        }
    }
    
    render () {
        return (
            <div>
                <NavigatorMenu />
                {/* Set the imput fields to let the user create a new reimbursement */}
                <h4>Enter Reimbursement info:</h4>
                <br/>
                <Container>
                    <Row>
                        <Col><strong>Amount:</strong></Col>
                        <Col><Input 
                        placeholder="$usd"
                        type="number"
                        name="amount"
                        onChange={(e)=>this.handleNewReimbInfo(e)}
                         /></Col>
                    </Row>
                    <Row>
                        <Col><strong>Description:</strong></Col>
                        <Col><Input 
                        placeholder="ex: Taxi cost"
                        name="description"
                        onChange={(e)=>this.handleNewReimbInfo(e)} /></Col>
                    </Row>
                    <Row>
                        <Col><strong>Type:</strong></Col>
                        <Col> 
                        <MuiThemeProvider>
                                <DropDownMenu
                                value={this.state.reimbType}
                                style={{background:'rgba(90,190,180,0.6)'}}
                                onChange={(e,i,v)=>this.handleReimbTypeChange(v)}>
                                    <MenuItem value={1} primaryText="Lodging" />
                                    <MenuItem value={2} primaryText="Travel" />
                                    <MenuItem value={3} primaryText="Food" />
                                    <MenuItem value={4} primaryText="Other" />
                                </DropDownMenu>
                            </MuiThemeProvider>
                        </Col>
                    </Row>
                    <Row>
                        <Col><strong>Today's date:</strong></Col>
                        <Col>
                        <Input type="date"
                        name="dateSubmitted"
                        onChange={(e)=>this.handleNewReimbInfo(e)}/>
                        </Col>
                    </Row>
                </Container>
                <br/>
                <Button
                onClick={()=>this.createNewReimbursement()}>
                    Create
                </Button>
            </div>
        );
    }
}