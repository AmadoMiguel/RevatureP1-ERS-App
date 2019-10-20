// Design taken and adapted from: 
// https://medium.com/technoetics/create-basic-login-forms-using-create-react-app-module-in-reactjs-511b9790dede

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import ersApi from '../util/ers-api';

// import { Redirect } from 'react-router-dom';
// import { Link } from 'react-router-dom';

export class LoginComponent extends React.Component <any,any> {
    constructor(props:any) {
        super(props);
        this.state = {
            username:'',
            password:'',
            token:''
        }
    }

    // Create axios post request to send the username and 
    // password for the login
    async handleClick() {
        if(this.state.username&&this.state.password){
            // Send post request to the /Login url
            // Receive the response back
            let userInfo = await ersApi.post('/Login',
                {
                    username:this.state.username,
                    password:this.state.password
                }
            );
            // Check response status code
            switch(userInfo.data.status){
                case 201: // Login succesful
                    // Set the user token value 
                    this.setState({token:userInfo.data.info[1].token});
                    // Use local storage to store current user information
                    localStorage.setItem('auth-token',this.state.token);
                    localStorage.setItem('Role',userInfo.data.info[0].role);
                    localStorage.setItem('email',userInfo.data.info[0].email);    
                    localStorage.setItem('username',userInfo.data.info[0].username);
                    localStorage.setItem('Last name',userInfo.data.info[0].lastName);
                    localStorage.setItem('First name',userInfo.data.info[0].firstName); 
                    localStorage.setItem('User ID',userInfo.data.info[0].userId);                                    
                    // Take user to menu page
                    this.props.history.replace("/main");
                    break;
                case 400: // Login failed
                    alert("Invalid credentials");
                    // Stay in login page
                    this.props.history.replace("/login");
                    break;
            }
        } else {
            // If any field is left blank
            alert('Please, insert your credentials');
        }
    }

    render () {
        return (
            <div>
                {/* Clear localStorage for new user every time the 
                login component is rendered by the browser */}
                {localStorage.clear()}
                <MuiThemeProvider>
                    <div>
                        {/* Title for the login page */}
                        <AppBar
                        style={{ background: '#2E3B55' }}
                        title='Login'
                        />
                        
                        {/* Text fields for username and password with 
                        onChange listeners */}
                        <TextField
                        inputStyle={{background:"rgba(2,130,20,0.3)",
                        color:"black"}}
                        floatingLabelText="Username"
                        floatingLabelStyle={{color:"darkblue",fontFamily:"sans-serif"}}
                        onChange = {(event,newValue) => 
                            this.setState({username:newValue})}
                        />
                        <br/><br/>
                        <TextField
                        inputStyle={{background:"rgba(2,130,20,0.3)",
                        color:"black"}}
                        type="password"
                        floatingLabelText="Password"
                        floatingLabelStyle={{color:"darkblue"}}
                        onChange = {(event,newValue) => 
                            this.setState({password:newValue})}
                        />
                        <br/><br/>
                        {/* Login button with onClick listener */}
                        <RaisedButton label="Login"
                        primary={true} 
                        onClick={() => this.handleClick()}/>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
export default LoginComponent;