import * as React from 'react';
import NavigatorMenu from './navig-component';
import { Link } from 'react-router-dom';

export class ReimbsComponent extends React.Component {
    render () {
        return (
            <div>
                <NavigatorMenu />
                <h3>ERS reimbursements</h3>
                <br/>
                <div 
                id="search-reimbursements-box"
                className="col-10 col-sm-12 col-md-12 col-lg-8 col-xl-4">
                    <h5>Search reimbursements</h5>
                    <hr/>
                    <Link to='reimbursement/status' >By status</Link>
                    <br/>
                    or
                    <br/>
                    <Link to='/author' >By author</Link>
                </div>
            </div>
        );
    }
}