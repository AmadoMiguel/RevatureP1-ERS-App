import * as React from 'react';
import NavigatorMenu from './navig-component';
import { Link } from 'react-router-dom';
import { DropDownMenu, MenuItem } from 'material-ui';
import { MuiThemeProvider } from 'material-ui/styles';

interface IReimbursement {
    reimbursementId:0,
    author:'',
    amount:0,
    dateSubmitted:'',
    dateResolved:'',
    description:'',
    resolver:'',
    status:'',
    type:'',
    selectorValue:1
}

export class ReimbursementsByStatus extends React.Component <IReimbursement,any> {
    constructor(props:IReimbursement) {
        super(props);
        this.state={
            reimbursementId:0,
            author:'',
            amount:0,
            dateSubmitted:'',
            dateResolved:'',
            description:'',
            resolver:'',
            status:'',
            type:'',
            selectorValue:1
        }
    }
    handleStatusSelector(v:any) {
        this.setState({
            selectorValue:v
        })
    }
    render () {
        return (
            <div>
                <NavigatorMenu />
                <br/>
                <h3>Search reimbursement by status: </h3>
                <hr className="col-8"/>
                <MuiThemeProvider>
                    <DropDownMenu
                    value={this.state.selectorValue}
                    onChange={(e,i,v)=>this.handleStatusSelector(v)}
                    style={{background:'lightgray'}}>
                        <MenuItem value={1} primaryText="Pending" />
                        <MenuItem value={2} primaryText="Resolved" />
                        <MenuItem value={3} primaryText="Denied" />
                    </DropDownMenu>
                </MuiThemeProvider>
                <br/>
                
                
                {/* <button>Search</button> */}
            </div>
        );
    }
}