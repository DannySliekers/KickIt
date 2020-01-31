import React from 'react';
import './App.css';
import Calendar from './Components/Calendar/Calendar';
import {Switch, Route} from 'react-router-dom';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Menu from './Components/Menu/Menu.js';
import Friends from './Components/Friends/Friends.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PulseLoader from 'react-spinners/PulseLoader';
import { css } from "@emotion/core";

toast.configure();
const override = css`
  display: block;
  margin: 2;
  border-color: black;
`;

class App extends React.Component { 
	constructor(){
		super();
		this.state = {
		auth: null
		}
	}

	componentDidMount(){
		fetch('http://localhost:3000/api/authorized')
		.then(result => result.json())
		.then(data => this.setState({auth: data.result}))
		.catch(err => console.error(err));
	}

	render(){
		if(this.state.auth == null){
			return (
				<div className="loading">
					<PulseLoader css={override}/>	
				</div>
			);
		} else {
			if(this.state.auth === false){
				return (
					<div>
						<Menu showLogout={false}/>
						<div className="App">
						<Switch>
							<Route exact path="/" component={Login}/>
							<Route path="/register" component={Register}/>
							<PrivateRoute path="/friends" auth={this.state.auth} component={Friends}/>
							<PrivateRoute path="/app" auth={this.state.auth} component={Calendar} />
						</Switch>
						</div>
					</div>
				);
			} else {
				return (
					<div>
						<Menu showLogout={true}/>
						<div className="App">
							<Switch>
							<Route exact path="/" component={Login}/>
							<Route path="/register" component={Register}/>
							<PrivateRoute path="/friends" auth={this.state.auth} component={Friends}/>
							<PrivateRoute path="/app" auth={this.state.auth} component={Calendar} />
							</Switch>
						</div>
					</div>
				);
			}
		}
	}
}

export default App;
