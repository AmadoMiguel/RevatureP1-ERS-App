import * as React from 'react';
import NavigatorMenu from './navig-component';
import { CurrentUserComponent } from './user-component';
import { PleaseLoginComponent } from './please-login-component';

export class MenuComponent extends React.Component {
    render () {
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
                            {localStorage.getItem('First name')} {localStorage.getItem('Last name')} 
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