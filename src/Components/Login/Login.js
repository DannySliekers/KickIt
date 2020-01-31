import React from 'react';
import './Login.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Login extends React.Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            message: '',
            loginFailed: false
        }

        this.onUserChange = this.onUserChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.Login = this.Login.bind(this);
    
    }

    onUserChange(e){
        this.setState({username: e.target.value, loginFailed: false});
    }

    onPasswordChange(e){
        this.setState({password: e.target.value, loginFailed: false});
    }

    Login() {
        //check for alphanumeric
        var regex = RegExp(/^$|^[a-zA-Z0-9]+$/i);
        if(regex.test(this.state.username)){
            fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            })
            .then(response => {
                if(response.redirected){
                    window.location.href = response.url;
                } else {
                    const data = response.json();
                    return Promise.all([data]);
                }
            })
            .then(res => this.setState({message: res[0].message, loginFailed: true}));
        } else {
            this.setState({message: "Username doesn't belong to an account.", loginFailed: true});
        }
    }

    //dumb weird shit to show error messages
    showLogin() {
        if(this.state.loginFailed){
            if(this.state.message === "False password."){
                return (
                    <div>
                        <TextField onChange={this.onUserChange} className="loginField" id="standard-basic" label="Username" variant="outlined" />
                        <TextField
                                error
                                id="outlined-error-helper-text"
                                label="Password"
                                type="password"
                                defaultValue={this.state.password}
                                helperText={this.state.message}
                                onChange={this.onPasswordChange}
                                className="passwordField"
                                variant="outlined"/>
                    </div>
                );
            }
            return (
                <div>
                    <TextField
                    error
                    id="outlined-error-helper-text"
                    label="Username"
                    defaultValue={this.state.username}
                    helperText={this.state.message}
                    onChange={this.onUserChange}
                    className="loginField"
                    variant="outlined"/>
                    <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"
                            className="passwordField"
                            onChange={this.onPasswordChange}
                            />
                </div>
            );
        } else {
            return (
                <div>
                    <TextField onChange={this.onUserChange} className="loginField" id="standard-basic" label="Username" variant="outlined" />
                    <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"
                            className="passwordField"
                            onChange={this.onPasswordChange}
                            />
                </div>
            );
        }
    }

    render(){
        return(
            <div>
                <div className="Login">
                    {this.showLogin()}
                    <Button variant="outlined" onClick={this.Login}>Login</Button>
                </div>
            </div>
            
        )
    }

}

export default Login;