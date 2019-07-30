import * as React from 'react';
import NavigatorMenu from './navig-component';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { PleaseLoginComponent } from './please-login-component';

export class ReimbsComponent extends React.Component <any,any> {

    goToCreateReimbursement() {
        this.props.history.replace("/reimbursements/create");
    }

    render () {
        return (
            <div>
                {
                    (localStorage.getItem('auth-token'))?
                    <div>
                        <NavigatorMenu />
                        <h3>ERS reimbursements</h3>
                        <br/>
                        <div 
                        id="search-reimbursements-box"
                        className="col-10 col-sm-12 col-md-5 col-lg-8 col-xl-4">
                            <h5>Search reimbursements</h5>
                            <hr/>
                            {
                                (localStorage.getItem("Role")==="Regular employee")?
                                <div>
                                    <Link to="reimbursements/my-reimbursements" >
                                        My reimbursements
                                    </Link>
                                </div>
                                :
                                <div>
                                    <Link to='reimbursements/status' >By status</Link>
                                    <br/>
                                    or
                                    <br/>
                                    <Link to='reimbursements/author' >By author</Link>
                                </div>
                            }
                        </div>
                        {/* Button for changing to create new reimbursement mode */}
                        <br/>
                        <Button onClick={()=>this.goToCreateReimbursement()}>Create new reimbursement</Button>
                    </div>:
                    <div>
                        <br/><br/>
                        <PleaseLoginComponent />
                    </div>
                }
            </div>
        );
    }
}