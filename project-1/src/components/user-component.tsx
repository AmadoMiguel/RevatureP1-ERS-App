import React from 'react';

// Component to display current user information, whose information
// is being stored locally
// This way of displaying user info is only done for the current user
// since is in the login component where the response (with the user info)
// is received
export class CurrentUserComponent extends React.Component <any,any> {
    render () {
        return (
            // Define container for person information
            // Set responsive display according to size 
            <div className="user-info-container col-9 col-sm-6 col-md-4 col-lg-6 col-xl-3">
                Your info:
                <ul id="user-info-list" style={{listStyleType:"none",background:'rgba(90,190,180,0.6)'}}>
                    <li key="user-id"><strong>User Id</strong> : {localStorage.getItem("User ID")}</li>
                    <li key="first-name"><strong>First Name</strong> : {localStorage.getItem("First name")}</li>
                    <li key="last-name"><strong>Last Name</strong> : {localStorage.getItem("Last name")}</li>
                    <li key="username"><strong>Username</strong> : {localStorage.getItem("username")}</li>
                    <li key="email"><strong>Email</strong> : {localStorage.getItem("email")}</li>
                    <li key="role"><strong>Role</strong> : {localStorage.getItem("Role")}</li>
                </ul>
            </div>
        );
    }
}