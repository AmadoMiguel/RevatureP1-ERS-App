import * as React from 'react';
import NavigatorMenu from './navig-component';
import { Button, Container, Row, Col, Input } from 'reactstrap';
import ersApi from '../util/ers-api';
import Axios from 'axios';
import { User } from '../models/user-model';

export class ReimbursementsByAuthor extends React.Component <any,any> {
    constructor(props:any) {
        super(props);
        this.state={
            reimbursements:[],
            inputValue:0,
            authorization:0,
            searching:true
        }
    }
    handleInputChange(e:any) {
        const val = e.target.value;
        this.setState({
            inputValue:(val)?val:0,
            searching:true
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
        `/Reimbursements/author/${this.state.inputValue}`
        ,config);
        switch(foundReimbursements.data.status){
            case 404: // Not found
                alert("No found reimbursements");
                this.setState({
                    authorization:foundReimbursements.data.status,
                    searching:true
                });
                break;
            case 200: // Reimbursements found
                this.setState({
                    authorization:foundReimbursements.data.status,
                    reimbursements:foundReimbursements.data.info,
                    searching:false
                });
                break;
            case 403:
                this.setState({
                    authorization:foundReimbursements.data.status,
                    searching:false
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
                // Request the reimbursements again in order to update the view
                this.getReimbursements();
                break;
        }
    }

    render () {
        // Get current user info
        const userJson = localStorage.getItem("Current User");
        const currUser = userJson !== null ? new User(JSON.parse(userJson)) : new User({});
        // Map each found reimbursement to a <tr> element, and assign each
        // reimbursement property (its values) to a <td> element.
        const reimbsAsRows = this.state.reimbursements.map((reimb:any) => {
            return(
                
                <tr key={reimb.id} className="table-info">
                    {
                        // Pending reimbursements can be solved. Two buttons (approve/deny) are provided
                        // for a finance/manager/admin to solve them.
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
                <h3>Search reimbursements by author ID: </h3>
                {
                    // Display this only for authorized roles
                    !(currUser.role==="Regular employee")
                    &&
                    <h6>(hint: pending reimbursements can be resolved)</h6>
                }
                <hr className="col-8"/>
                <Container>
                    <Row style={{textAlign:"center"}}>
                        <Col></Col>
                        <Col></Col>
                        <Col></Col>
                        <Col xs="3" sm='3' md='3' xl='2'>
                            <Input 
                            placeholder="ID"
                            onChange={(e:any)=>this.handleInputChange(e)}
                            />
                        </Col>
                        {/* This button triggers the get request for the reimbursements */}
                        <Col>
                            <Button onClick={()=>this.getReimbursements()}>
                                Search
                            </Button>
                        </Col>
                        <Col></Col>
                        <Col></Col>
                        <Col></Col>
                    </Row>
                    <br/>
                </Container>
                {
                    (!this.state.searching) ? 
                    (!(this.state.authorization === 403))?
                    // Show the table when user is not searching
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