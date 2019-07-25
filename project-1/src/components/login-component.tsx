import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { DeviceSignalCellular4Bar } from 'material-ui/svg-icons';
import { Link } from 'react-router-dom';

export class LoginComponent extends React.Component <any,any> {
    constructor(props:any) {
        super(props);
        this.state = {
            username:'',
            password:''
        }
    }

    // Create fetch post request to send the username and 
    // password for the login
    handleClick(event:any) {
        alert(`Credentials: ${this.state.username} ${this.state.password}`);
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
                        hintText="Enter your username"
                        floatingLabelText="Username"
                        onChange = {(event,newValue) => 
                            this.setState({username:newValue})}
                        />
                        <br/>
                        <TextField
                        type="password"
                        hintText="Enter your password"
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