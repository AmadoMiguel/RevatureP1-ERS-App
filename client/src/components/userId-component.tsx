import React from 'react';
import { PersonComponent } from './person-component';
import NavigatorMenu from './navig-component';
import ersApi from '../util/ers-api';
import Axios from 'axios';
import { ModifyPersonComponent } from './modify-user-component';
import { User } from '../models/user-model';
import { Button, Input, Container, Row, Label, Col } from 'reactstrap';

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
            searchStatus:0,
            changingUserInfo:false
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

    // Overwrite changes with changes to update user info from the modifyUserComponent
    handleNewUserInfoChange(e:any) {
        this.setState({
            [e.target.name]:e.target.value            
        });
    }
    // Send the request to update
    async handleUpdateClick() {
        const reqHeaders={"Authorization":localStorage.getItem('auth-token'),
        "Content-Type": "application/json"};
        const body = {
                userId:this.state.userId,
                firstName:this.state.firstName,
                lastName:this.state.lastName,
                username:this.state.username,
                email:this.state.email,
                // Depending on the provided role name, is going to be assigned a role id
                roleId:
                (this.state.role==="Regular employee")?
                1:(this.state.role==="finance")?
                2:(this.state.role==="manager")?
                3:(this.state.role==="admin")?
                4:
                null
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
        // Get current user information
        const userJson = localStorage.getItem("Current User");
        const currUser = userJson !== null ? new User(JSON.parse(userJson)) : new User({});
        return (
            <div>
                <NavigatorMenu />
                {/* Search user container */}
                <div>
                    <h3>Search user by Id: </h3>
                    <br/>
                    <Container>
                        <Row>       
                            <Col></Col>
                            <Col></Col>
                            <Col xl="1" xs="4" md="2">
                                <Input type="text" placeholder="ID #"
                                onChange={(e:any)=>this.handleInputSearch(e)} />
                            </Col>
                            <Col xl="4" xs="4" md="2">
                                <Button onClick={()=>this.handleUserSearch()}>Search</Button>
                            </Col>
                            <Col></Col>
                            <Col></Col>
                        </Row>
                    </Container>
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
                            (currUser.role==='admin')?
                                <div>
                                    <ModifyPersonComponent
                                    handle={this.handleNewUserInfoChange.bind(this)}
                                    update={this.handleUpdateClick.bind(this)} 
                                    userId={this.state.userId}
                                    firstName={this.state.firstName}
                                    lastName={this.state.lastName}
                                    username={this.state.username}
                                    email={this.state.email}
                                    role={this.state.role}/>
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