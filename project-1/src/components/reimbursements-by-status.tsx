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
    render () {
        // Map each found reimbursement to a <Row> element, and assign each
        // reimbursement property (its values) to a <Col> element.
        const reimbsAsRows = this.state.reimbursements.map((reimb:any) => {
            return(
                <Row key={reimb.id}>
                    {Object.values(reimb).map((prop:any)=>(<Col>{prop}</Col>))}
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
                        <Col></Col>
                        <Col></Col>
                        <Col xs="5" sm='4' md='4' xl='4'>
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
                        </Container>:
                        <div>You are not authorized</div>
                        :
                        <div></div>
                }
                
            </div>
        );
    }
}