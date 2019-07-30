import * as React from 'react';
import NavigatorMenu from './navig-component';
import { DropDownMenu, MenuItem } from 'material-ui';
import { MuiThemeProvider } from 'material-ui/styles';
import { Button, Container, Row, Col } from 'reactstrap';
import ersApi from '../util/ers-api';
import Axios from 'axios';

// In this component both get reimbursements by status and modifying
// reimbursements (either approving them or denying them) which status 
// is pending, is handled
export class ReimbursementsByStatus extends React.Component <any,any> {
    constructor(props:any) {
        super(props);
        this.state={
            reimbursements:[],
            selectorValue:1,
            authorization:0
        }
    }
    handleStatusSelector(v:any) {
        this.setState({
            selectorValue:v
        });
    }
    async getReimbursements() {
        // Send the request to the server
        // Configure request headers for auth token
        const config = {
            headers:
            {"Authorization":localStorage.getItem('auth-token'),
             "Content-Type": "application/json"}
        };
        // Variable that stores the response from the user
        let foundReimbursements = await ersApi.get(
        `/Reimbursements/status/${this.state.selectorValue}`
        ,config);
        switch(foundReimbursements.data.status){
            case 404: // Not found
                alert("No found reimbursements");
                this.setState({
                    authorization:foundReimbursements.data.status,
                    reimbursements:[]
                });
                break;
            case 200: // Reimbursements found
                this.setState({
                    authorization:foundReimbursements.data.status,
                    reimbursements:foundReimbursements.data.info
                });
                break;
            case 403:
                this.setState({
                    authorization:foundReimbursements.data.status,
                    reimbursements:[0]
                });  
                break;
        }
    }
    // This function will only be called if the reimbursement status is selected to
    // pending. The current user, if authorized, can select between aproving it and
    // denying it using a button on the status column.
    async solvePendingReimbursement(reimId:any,status:any){
        const reqHeaders={"Authorization":localStorage.getItem('auth-token'),
        "Content-Type": "application/json"};
        const body = {
            reimbursementId:parseInt(reimId),
            dateResolved: new Date().toISOString().slice(0,10),
            description:"Resolved",
            status: status
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
        switch(response.data.status) {
            case 201:
                alert(`Reimbursement number ${body.reimbursementId} succesfully ${(body.status===2)?"approved":"denied"}`);
                this.props.history.replace("/reimbursements");
                break;
        }
    }
    render () {
        // Map each found reimbursement to a <Row> element, and assign each
        // reimbursement property (its values) to a <Col> element.
        const reimbsAsRows = this.state.reimbursements.map((reimb:any) => {
            return(
                
                <tr key={reimb.id} className="table-info">
                    {
                        
                        Object.keys(reimb).map((key:any)=>
                            (
                                ((reimb.status==="Pending")&&(key==="status"))?
                                <td> 
                                    <Button
                                    style={{background:"green"}}
                                    className="approve-deny-button"
                                    onClick={()=>this.solvePendingReimbursement(reimb.id,2)}>
                                        A</Button> 
                                    <Button
                                    style={{background:"red"}}
                                    className="approve-deny-button"
                                    onClick={()=>this.solvePendingReimbursement(reimb.id,3)}>
                                        D</Button> 
                                </td>
                                :
                                <td>{reimb[key]}</td>
                            )
                        )
                    }
                </tr>
            )
        });
        return (
            <div>
                <NavigatorMenu />
                <h3>Search reimbursement by status: </h3>
                {/* Display this only for authorized roles */}
                {(localStorage.getItem("Role")==="admin"||localStorage.getItem("Role")==="finance"||
                localStorage.getItem("Role")==="manager")&&
                    <h6>(hint: pending reimbursements can be resolved)</h6>
                }
                <hr className="col-8"/>
                <Container>
                    <Row style={{textAlign:"center"}}>
                        <Col></Col>
                        <Col></Col>
                        <Col xs="5" sm='4' md='4' xl='4'>
                            <MuiThemeProvider>
                                <DropDownMenu
                                value={this.state.selectorValue}
                                onChange={(e,i,v)=>this.handleStatusSelector(v)}
                                style={{background:'rgba(90,190,180,0.5)'}}>
                                    <MenuItem value={1} primaryText="Pending" />
                                    <MenuItem value={2} primaryText="Approved" />
                                    <MenuItem value={3} primaryText="Denied" />
                                </DropDownMenu>
                            </MuiThemeProvider>
                        </Col>
                        {/* This button triggers the get request for the reimbursements */}
                        {/*  */}
                        <Col>
                            <Button onClick={()=>this.getReimbursements()}>
                                Search
                            </Button>
                        </Col>
                        <Col></Col>
                        <Col></Col>
                        <Col></Col>
                        <Col></Col>
                    </Row>
                </Container>
                {
                    (this.state.reimbursements.length)?
                    (!(this.state.authorization === 403))?
                        // Reimbursements table 
                        <div className="table-responsive reimb-table-container">
                            <table className="table ">
                            {/* First the headers */}
                            <thead>
                                <tr>
                                    <th scope='row'>Id</th>
                                    <th scope='row'>Author</th>
                                    <th scope='row'>Amount (usd)</th>
                                    <th scope='row'>Submitted on</th>
                                    <th scope='row'>Resolved on</th>
                                    <th scope='row'>Description</th>
                                    <th scope='row'>Resolver</th>
                                    <th scope='row'>Status</th>
                                    <th scope='row'>Type</th>
                                </tr>
                            </thead>
                            {/* All reimbursements are contained in reimbsAsRows */}
                            <tbody>
                                {reimbsAsRows}
                            </tbody>
                            </table>
                        </div>
                        :
                        <div>You are not authorized</div>
                    :
                        <div></div>
                }
            </div>
        );
    }
}