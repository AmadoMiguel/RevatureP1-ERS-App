import * as React from 'react';
import NavigatorMenu from './navig-component';
import { DropDownMenu, MenuItem } from 'material-ui';
import { MuiThemeProvider } from 'material-ui/styles';
import { Button, Container, Row, Col } from 'reactstrap';
import ersApi from '../util/ers-api';


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
                    authorization:foundReimbursements.data.status
                });
                break;
            case 200: // Reimbursements found
                this.setState({
                    authorization:foundReimbursements.data.status,
                    reimbursements:foundReimbursements.data.info
                });
            case 403:
                this.setState({
                    authorization:foundReimbursements.data.status
                });  
                break;
        }
    }
    render () {
        // Map each found reimbursement to a <Row> element, and assign each
        // reimbursement property (its values) to a <Col> element.
        const reimbsAsRows = this.state.reimbursements.map((reimb:any) => {
            return(
                <Row key={reimb.id}>
                    {
                        Object.values(reimb).map
                            (
                                (prop:any)=>(<Col>{prop}</Col>)
                            )
                    }
                </Row>
            )
        });
        return (
            <div>
                <NavigatorMenu />
                <h3>Search reimbursement by status: </h3>
                <hr className="col-8"/>
                <Container>
                    <Row style={{textAlign:"center"}}>
                        <Col xs="6" sm='6' md='6' xl='6'>
                            <MuiThemeProvider>
                                <DropDownMenu
                                value={this.state.selectorValue}
                                onChange={(e,i,v)=>this.handleStatusSelector(v)}
                                style={{background:'lightgray'}}>
                                    <MenuItem value={1} primaryText="Pending" />
                                    <MenuItem value={2} primaryText="Approved" />
                                    <MenuItem value={3} primaryText="Denied" />
                                </DropDownMenu>
                            </MuiThemeProvider>
                        </Col>
                        {/* This button triggers the get request for the reimbursements */}
                        <Col xs="6" sm='6' md='6' xl='6'>
                            <Button onClick={()=>this.getReimbursements()}>
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Container>
                {/* Display reimbursements as a table using bootstrap columns */}
                <Container className="reimbursements-table">
                    {/* First the headers */}
                    <Row>
                        <Col>Id</Col>
                        <Col>Author</Col>
                        <Col>Amount (usd)</Col>
                        <Col>Submitted on</Col>
                        <Col>Resolved on</Col>
                        <Col>Description</Col>
                        <Col>resolver</Col>
                        <Col>Status</Col>
                        <Col>Type</Col>
                    </Row>
                    <hr/>
                    {/* All reimbursements are contained in reimbsAsRows */}
                    {reimbsAsRows}
                </Container>
                
            </div>
        );
    }
}