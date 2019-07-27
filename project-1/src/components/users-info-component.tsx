import React from 'react';
import { PersonComponent, IPersonProps } from './person-component';
import NavigatorMenu from './navig-component';
import ersApi from '../util/ers-api';

export class UsersInfoComponent extends React.Component<any,any> {
    constructor(props:any) {
        super(props);
        this.state = {
            users:[],
            reqStatus:0
        }
    }

    // Send request to get all users info
    async getAllUsers() {
        // Configure request headers for auth token
        const config = {
            headers:
            {"Authorization":localStorage.getItem('auth-token'),
             "Content-Type": "application/json"}
        };
        let allUsersInfo = await ersApi.get('/Users',config);
        // Handle the received status
        switch(allUsersInfo.data.status){
            case(404):
                this.setState({
                    reqStatus:allUsersInfo.data.status
                });
                break;
            case(200):
                // Store all users information in the
                // array
                this.setState({
                    ...this.state,
                    users:allUsersInfo.data.info.sort()
                });
                break;
            case(403):
                this.setState({
                    reqStatus:allUsersInfo.data.status
                });
                break;
        }

    }

    render() {
        // Map each user object into PersonComponent inside a div
        const usersComponents = this.state.users.map((user:IPersonProps) =>{
            return (
            <div key={user.userId} 
            className="user-card user-info-container col-12 col-sm-6 col-md-4 col-lg-6 col-xl-4"
            id="user-info-list"> 
                <PersonComponent {...user} /> 
            </div>);
        });
        
        return (
            <div>
                <NavigatorMenu />
                <br/>
                {/* Trigger the request to the server */}
                <button onClick={()=>this.getAllUsers()}>
                    Search
                </button>
                <br/>
                <div className="scrolling-wrapper-flexbox">
                    {usersComponents}
                </div>
            </div>
        );
    }
}