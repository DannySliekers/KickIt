import React from 'react';
import './Register.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Register extends React.Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            email: '',
            showDuplicate: false,
            showBadRequest: false,
            showSuccesful: false,
            showAlphanumeric: false,
            showPasswordLength: false
        }

        this.onUserChange = this.onUserChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.Register = this.Register.bind(this);
    }

    onUserChange(e){
        this.setState({username: e.target.value, showDuplicate: false, showBadRequest: false, showSuccesful: false, showAlphanumeric: false, showPasswordLength: false});
    }

    onPasswordChange(e){
        this.setState({password: e.target.value, showDuplicate: false, showBadRequest: false, showSuccesful: false, showAlphanumeric: false, showPasswordLength: false});
    }

    onEmailChange(e){
        this.setState({email: e.target.value, showDuplicate: false, showBadRequest: false, showSuccesful: false, showAlphanumeric: false, showPasswordLength: false});
    }
    
    Register() {
        if(this.state.password.length > 5) {
            var regex = RegExp(/^$|^[a-zA-Z0-9]+$/i);
            if(regex.test(this.state.username)){
                fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: this.state.username,
                        password: this.state.password,
                        email: this.state.email
                    })
                })
                .then(response =>  {
                    if(response.status === 400) {
                        this.setState({showBadRequest: true});
                    // i use code 401(unauthorized) for duplicate usernames
                    } else if (response.status === 401) {
                        this.setState({showDuplicate: true});
                    } else {
                        window.location.href = "http://localhost:3000/app";
                    }
                });
            } else {
                this.setState({showAlphanumeric: true});
            }
        } else {
            this.setState({showPasswordLength: true});
        }
    }

    //dumb weird shit to show error messages
    showRegister() {
        if(!this.state.showSuccesful){
            if(this.state.showDuplicate){
                return (
                    <div>
                        <TextField
                            error
                            id="outlined-error-helper-text"
                            label="Username"
                            helperText="Username already exists."
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
                            onChange={this.onPasswordChange}/>
                        <Button variant="outlined" onClick={this.Register}>Register</Button>
                    </div>
                );
            } else if (this.state.showAlphanumeric) {
                return (
                    <div>
                        <TextField
                            error
                            id="outlined-error-helper-text"
                            label="Username"
                            helperText="Please use alphanumeric characters for your username"
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
                            onChange={this.onPasswordChange}/>
                        <Button variant="outlined" onClick={this.Register}>Register</Button>
                    </div>
                );
            } else if (this.state.showBadRequest){
                return (
                    <div>
                        <TextField
                            error
                            id="outlined-error-helper-text"
                            label="Username"
                            helperText="Please fill in all fields."
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
                            onChange={this.onPasswordChange}/>
                        <Button variant="outlined" onClick={this.Register}>Register</Button>
                    </div>
                );
            } else if (this.state.showPasswordLength){
                return (
                    <div>
                        <TextField onChange={this.onUserChange} className="registerField" id="standard-basic" label="Username" variant="outlined" />
                        <TextField
                                error
                                id="outlined-error-helper-text"
                                label="Password"
                                type="password"
                                helperText="Your password should consist of at least 6 characters"
                                onChange={this.onPasswordChange}
                                className="passwordField"
                                variant="outlined"/>
                        <Button variant="outlined" onClick={this.Register}>Register</Button>
                    </div>
                );
            } else {
                return (
                    <div>
                        <TextField onChange={this.onEmailChange} className="registerField" id="standard-basic" label="Email" variant="outlined" />
                        <TextField onChange={this.onUserChange} className="registerField" id="standard-basic" label="Username" variant="outlined" />
                        <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        className="passwordField"
                        onChange={this.onPasswordChange}/>
                        <Button variant="outlined" onClick={this.Register}>Register</Button>
                    </div>
                );
            }
        } else {
            return (<p>User added, please login.</p>);
        }
    }

    render(){
        return(
            <div>
                <div className="Register">
                    {this.showRegister()}
                </div>
            </div>
            
        )
    }

}

export default Register;