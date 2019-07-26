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
                <div>
                    <Link to="/users">All users info</Link>     
                </div>    
                or
                <br/>
                <div>
                    <Link to="/user">User by ID</Link>     
                </div>
            </div>
        );
    }
}