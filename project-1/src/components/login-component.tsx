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

    // Create fetch post request to send the username and 
    // password for the login
    async handleClick(event:any) {
        if(this.state.username&&this.state.password){
            // Send post request to the /Login url
            let userInfo = await ersApi.post('/Login',{
                username:this.state.username,
                password:this.state.password
            }
            );
            // Check response status code
            switch(userInfo.data.status){
                case 201:
                    this.setState({token:userInfo.data.info[1].token});
                    alert(`Welcome, ${userInfo.data.info[0].firstName}`);
                    break;
                case 400:
                    alert("Invalid credentials");
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
                <MuiThemeProvider>
                    <div>
                        <AppBar
                        title='Login'
                        />
                        <TextField
                        floatingLabelText="Username"
                        onChange = {(event,newValue) => 
                            this.setState({username:newValue})}
                        />
                        <br/>
                        <TextField
                        type="password"
                        floatingLabelText="Password"
                        onChange = {(event,newValue) => 
                            this.setState({password:newValue})}
                        />
                        <br/>

                        <RaisedButton label="Login"
                        primary={true} 
                        onClick={(event) => this.handleClick(event)}/>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
export default LoginComponent;