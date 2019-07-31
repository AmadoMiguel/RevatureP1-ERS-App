import React from 'react';
import { PersonComponent } from './person-component';
import NavigatorMenu from './navig-component';
import ersApi from '../util/ers-api';
import { Container, Row, Col } from 'reactstrap';
import { MuiThemeProvider } from 'material-ui/styles';
import { TextField } from 'material-ui';
import Axios from 'axios';
import { ModifyPersonComponent } from './modify-user-component';
// This component is planned to handle both search and update information to any 
// particular user
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
        if (!this.state.inputValue) {
            alert("Please, type an ID");
        } else{
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
                case (403): // Unauthorized
                    this.setState({
                        searched:true,
                        searchStatus:response.data.status
                    });    
                    break;
                default: break;    
            }
        }
    }

    // Overwrite changes with changes if any
    handleNewUserInfoChange(updatesOnUser:any) {
        this.setState({
            ...this.state,
            ...updatesOnUser            
        });
    }

    async handleUpdateClick() {
        const reqHeaders={"Authorization":localStorage.getItem('auth-token'),
        "Content-Type": "application/json"};
        const body = {
                userId:this.state.userId,
                firstName:this.state.firstName,
                lastName:this.state.lastName,
                username:this.state.username,
                email:this.state.email,
                role:this.state.role
        };
        // Send the request to update user info
        console.log(this.state);
        const response = await 
        Axios(
            {method:"PATCH",
            url:"http://localhost:3006/Users",
            headers:reqHeaders,
            data:body
            }
        );
        // If update is successful redirects to users menu
        switch(response.status){
            case 200:
                alert("Update successful");
                this.props.history.replace("/users-menu");
                break;    
        }
    }
    render () {
        return (
                <div>
                    <NavigatorMenu />
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
                        (!(this.state.searchStatus===403))?
                        <div className="user-info-container col-12 col-sm-12 col-md-12 col-lg-8 col-xl-4"
                            id ="user-info-list">
                            {/* Allow users info modification only for admin */}
                            {
                                (localStorage.getItem('Role')==='admin')?
                                <div>
                                    <div>
                                        <ModifyPersonComponent
                                        handle={this.handleNewUserInfoChange.bind(this)} 
                                        userId={this.state.userId}
                                        firstName={this.state.firstName}
                                        lastName={this.state.lastName}
                                        username={this.state.username}
                                        email={this.state.email}
                                        role={this.state.role}/>
                                    </div>
                                    {/* This button triggers the patch request to the server */}

                                    <button 
                                    id="update-user-button"
                                    onClick={()=>this.handleUpdateClick()}>
                                        Update
                                    </button>
                                </div>
                                // If not an admin, only display user info without editable text fields
                                :
                                <div>
                                    <PersonComponent 
                                    userId={this.state.userId}
                                    firstName={this.state.firstName}
                                    lastName={this.state.lastName}
                                    username={this.state.username}
                                    email={this.state.email} 
                                    role={this.state.role} />
                                </div>
                            }
                        </div>
                        :
                        <div>You don't have access to this information.</div>
                        :
                        <div></div>
                    }
                </div>
        );
    }
}