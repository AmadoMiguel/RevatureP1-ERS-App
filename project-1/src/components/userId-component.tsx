import React from 'react';
import { PersonComponent } from './person-component';
import NavigatorMenu from './navig-component';
import ersApi from '../util/ers-api';

export class UserByIdComponent extends React.Component <any,any> {
    constructor(props:any) {
        super(props);
        // Set initial state for the user info 
        // to be displayed
        this.state = {
            userId:'',
            firstName:'',
            lastName:'',
            username:'',
            email:'',
            role:'',
            inputValue:'',
            searched:false,
            searchStatus:0
        }
    }

    handleInputSearch(e:any) {
        // Update searched id to be queried to 
        // the server
        const searchedId = e.target.value;
        this.setState({
            ...this.state,
            inputValue:searchedId,
            searched:false
        });
    }

    // When user clicks the search button this is
    // triggered
    async handleUserSearch() {
        // Receive response from the server
        // Configure the headers for the request
        const config = {
            headers:
            {"Authorization":localStorage.getItem('auth-token'),
             "Content-Type": "application/json"}
        };
        const response = await ersApi.get(`/Users/${this.state.inputValue}`,
        config);
        // Handle the received status
        switch(response.data.status) {
            case (404): // User not found
                alert(`User with id ${this.state.inputValue} not found`);
                this.setState({searched:false});
                break;
            case (200): // Shows the user information
                this.setState({
                    searched:true,
                    userId:response.data.info.userId,
                    firstName:response.data.info.firstName,
                    lastName:response.data.info.lastName,
                    username:response.data.info.username,
                    email:response.data.info.email,
                    role:response.data.info.role,
                    searchStatus:response.data.status
                });
                break;
            case (403): // Shows the user information
                this.setState({
                    searched:true,
                    searchStatus:response.data.status
                });    
                break;
            default: break;    
        }
        // Handle promise success
        try { // Fill in the state properties with the response
            this.setState({
                
            });
        } catch {

        }
    }

    render () {
        return (
            <div>
                <NavigatorMenu />
                <br/>
                {/* Search user container */}
                <div>
                    <h3>Search user by Id: </h3>
                    <br/>
                    <label htmlFor="search-user">Enter user Id: </label>
                    <input type="text" placeholder="ID #"
                    onChange={(e:any)=>this.handleInputSearch(e)} />
                    <button onClick={()=>this.handleUserSearch()}>Search</button>
                </div>
                {/* Show user info container */}
                {
                    // Handle properly the different displays according to access
                    (this.state.searched)?
                    !(this.state.searchStatus===403)?
                    <div className="user-info-container col-9 col-sm-6 col-md-4 col-lg-6 col-xl-3"
                        id ="user-info-list">
                        <PersonComponent 
                        userId={this.state.userId}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        username={this.state.username}
                        email={this.state.email} 
                        role={this.state.role} />
                    </div>:
                    <div>You don't have access to this information.</div>
                    :
                    <div></div>
                }
            </div>
        );
    }
}