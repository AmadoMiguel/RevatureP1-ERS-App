import * as React from 'react';
import NavigatorMenu from './navig-component';
import { CurrentUserComponent } from './user-component';

export class MenuComponent extends React.Component {
    render () {
        return (
            <div>
                {/* Navigate to select any other component */}
                <NavigatorMenu />
                <h3>Welcome,</h3>
                {
                    <h4>
                        {localStorage.getItem('First name')} {localStorage.getItem('Last name')} 
                    </h4>
                }
                <br/>
                {/* Personal info container */}
                <CurrentUserComponent />
            </div>
        );
    }
}