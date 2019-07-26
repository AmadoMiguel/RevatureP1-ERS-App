import * as React from 'react';
import NavigatorMenu from './navig-component';

export class UsersComponent extends React.Component {
    render () {
        return (
            <div>
                <NavigatorMenu />
                Here are all the users 
            </div>
        );
    }
}