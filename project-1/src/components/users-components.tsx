import * as React from 'react';
import NavigatorMenu from './navig-component';
import { Link } from 'react-router-dom';

export class UsersMenuComponent extends React.Component {
    render () {
        return (
            <div>
                {/* Navigate around the menu options */}
                <NavigatorMenu />
                {/* Two options: all user's information or
                user by id */}
                <h3>ERS users</h3>
                <br/>
                <div id="get-users-info-box" className="col-8 col-sm-6 col-md-4 col-lg-6 col-xl-4">
                    <h5>Search users info</h5>
                    <hr/>
                    <div>
                        <Link to="/users">All users info</Link>     
                    </div>    
                    or
                    <br/>
                    <div>
                        <Link to="/user">User by ID</Link>     
                    </div>
                </div>
            </div>
        );
    }
}