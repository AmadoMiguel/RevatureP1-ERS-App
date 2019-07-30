import * as React from 'react';
import NavigatorMenu from './navig-component';
import { Button, Container, Row, Col, Input } from 'reactstrap';
import ersApi from '../util/ers-api';

export class ReimbursementsByAuthor extends React.Component <any,any> {
    constructor(props:any) {
        super(props);
        this.state={
            reimbursements:[],
            inputValue:1,
            authorization:0,
            searching:true
        }
    }
    handleInputChange(e:any) {
        const val = e.target.value;
        this.setState({
            inputValue:val,
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
    render () {
        // Map each found reimbursement to a <Row> element, and assign each
        // reimbursement property (its values) to a <Col> element.
        const reimbsAsRows = this.state.reimbursements.map((reimb:any) => {
            return(
                <tr key={reimb.id} className="table-info">
                    {Object.values(reimb).map((prop:any)=>(<td>{prop}</td>))}
                </tr>
            )
        });
        return (
            <div>
                <NavigatorMenu />
                <h3>Search reimbursement by author ID: </h3>
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