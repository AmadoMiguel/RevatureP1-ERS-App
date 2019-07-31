import * as React from 'react';
import NavigatorMenu from './navig-component';
import { Button, Container, Row, Col, Input } from 'reactstrap';
import ersApi from '../util/ers-api';
import Axios from 'axios';

export class MyReimbursementsComponent extends React.Component <any,any> {
    constructor(props:any) {
        super(props);
        this.state={
            reimbursements:[]
        }
    }
    // Send the request to the server when component is mounted
    async componentDidMount() {
        // Configure request headers for auth token
        const config = {
            headers:
            {"Authorization":localStorage.getItem('auth-token'),
             "Content-Type": "application/json"}
        };
        // Variable that stores the response from the user
        let foundReimbursements = await ersApi.get(
        `/Reimbursements/author/${localStorage.getItem("User ID")}`
        ,config);
        console.log(foundReimbursements.data);
        switch(foundReimbursements.data.status){
            case 404: // Not found
                alert("You don't have reimbursements");
                this.setState({
                    reimbursements:[]
                });
                break;
            case 200: // Reimbursements found
                this.setState({
                    reimbursements:foundReimbursements.data.info
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
                    {Object.keys(reimb).map((key:any)=>(<td>{reimb[key]}</td>))}
                </tr>
            )
        });
        return (
            <div>
                <NavigatorMenu />
                <br/>
                {
                    (this.state.reimbursements.length) ?
                    // Show the table when user is not searching
                    <div className="table-responsive reimb-table-container">
                        <table className="table ">
                        {/* First the headers */}
                        <thead>
                            <tr>
                                <th scope='row'>#</th>
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
                    <div></div>
                }
            </div>
        );
    }
}