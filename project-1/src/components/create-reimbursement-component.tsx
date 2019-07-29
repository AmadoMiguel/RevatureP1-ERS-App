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
    handleAmountChange(e:any){
        const amount = e.target.value;
        this.setState({
            amount:parseInt(amount)
        })
    }
    handleDescriptionChange(e:any) {
        const newDescription = e.target.value;
        this.setState({
            description:newDescription
        })
    }
    // Handle reimbursement type selector
    handleReimbTypeChange(v:any) {
        this.setState({
            reimbType:v
        })
    }
    // Handle date submitted selector
    handleDateSubmitChange(e:any) {
        const date = e.target.value;
        this.setState({
            dateSubmitted:date
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
            {method:"PATCH",
            url:"http://localhost:3006/Reimbursements",
            headers:reqHeaders,
            data:body
            }
        );
        // Handle response status
        
    }

    render () {
        return (
            <div>
                <NavigatorMenu />
                {/* Set the imput fields to let the user create a new reimbursement */}
                <h4>Create a new Reimbursement</h4>
                <br/>
                <Container>
                    <Row>
                        <Col><strong>Amount:</strong></Col>
                        <Col><Input 
                        placeholder="$usd"
                        type="number"
                        onChange={(e)=>this.handleAmountChange(e)}
                         /></Col>
                    </Row>
                    <Row>
                        <Col><strong>Description:</strong></Col>
                        <Col><Input 
                        placeholder="ex: Taxi cost"
                        onChange={(e)=>this.handleDescriptionChange(e)} /></Col>
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
                        onChange={(e)=>this.handleDateSubmitChange(e)}/>
                        </Col>
                    </Row>
                </Container>
                <br/>
                <Button>
                    Create
                </Button>
            </div>
        );
    }
}