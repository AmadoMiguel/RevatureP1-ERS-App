import * as React from 'react';
import NavigatorMenu from './navig-component';

export class MenuComponent extends React.Component {
    render () {
        // Map user info to a list
        var userInfoKeys :Array<string|null> = [] ;
        for (var i = 0;i < localStorage.length;i++){
            // Don't show the token
            if(localStorage.key(i) === 'auth-token') {
                continue;
            }
            userInfoKeys.push(localStorage.key(i));
        }
        // Now, assign each list item to a list element 
        // to display user information in the screen 
        // As a list
        var userInfo = userInfoKeys.map((k:any) => {
            return (<li key={k}><strong>{k}</strong> : {localStorage.getItem(k)}</li>)
        });
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
                <div id="user-info-container" className="col-sm-6 col-md-6 col-lg-8 col-xl-8">
                    <ul id="user-info-list" style={{listStyleType:"none"}}>
                        {userInfo}
                    </ul>
                </div>
            </div>
        );
    }
}