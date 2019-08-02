import * as React from 'react';
import NavigatorMenu from './navig-component';
import { CurrentUserComponent } from './user-component';
import { PleaseLoginComponent } from './please-login-component';
import { User } from '../models/user-model';

export class MenuComponent extends React.Component {
    render () {
        // Get current user info
        const userJson = localStorage.getItem("Current User");
        const currUser = userJson !== null ? new User(JSON.parse(userJson)) : new User({});
        return (
            <div>
                {
                    // If user is not logged in, can't go into the app components
                    (localStorage.getItem('auth-token'))?
                    <div>
                        {/* Navigate to select any other component */}
                        <NavigatorMenu />
                        <h3>Welcome,</h3>
                        <h4>
                            {currUser.firstName} {currUser.lastName} 
                        </h4>
                        <br/>
                        <CurrentUserComponent />
                    </div>
                    :
                    <div>
                        <br/><br/>
                        <PleaseLoginComponent />
                    </div>
                }
            </div>
        );
    }
}