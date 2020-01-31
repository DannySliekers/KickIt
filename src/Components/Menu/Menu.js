import React from 'react';
import './Menu.css';
import {Link} from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from '@material-ui/icons/Home';
import ListAltIcon from '@material-ui/icons/ListAlt';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

class Menu extends React.Component {
	state = {
		openDrawer: false,
		requestCount: 0
	};

	componentDidMount(){
		if(this.props.showLogout){
			this.countRequests();
		}
	}

	countRequests = _ => {
		fetch('http://localhost:3000/api/getRequestCount')
		.then(results => results.json())
		.then(results => this.setState({requestCount: results.data[0].count}))
		.catch(err => console.error(err));
	}

	logOut = _ => {
		fetch('http://localhost:3000/api/logout')
		.then(response => {
			// HTTP 301 response
			// HOW CAN I FOLLOW THE HTTP REDIRECT RESPONSE?
			if (response.redirected) {
				window.location.href = response.url;
			}})
			.catch(err => console.error(err));
	}

	closeDrawer = () => {
		this.setState({openDrawer: false});
	}
	
	openDrawer = () => {
		if(this.props.showLogout){
			this.countRequests();
		}
		this.setState({openDrawer: true});
	}

	render(){
		if(this.props.showLogout === false){
			return (
				<div>
					<IconButton aria-label="menu" onClick={this.openDrawer}>
						<MenuIcon />
					</IconButton>
					<Drawer open={this.state.openDrawer} onClose={this.closeDrawer}>
						<List className="menuDrawer">
							<ListItem component={Link} to="/" button key="home" onClick={this.closeDrawer}>
								<ListItemIcon><HomeIcon></HomeIcon></ListItemIcon>
								<ListItemText primary="Home"></ListItemText>
							</ListItem>
							<ListItem component={Link} to="/register" button key="register" onClick={this.closeDrawer}>
								<ListItemIcon><ListAltIcon></ListAltIcon></ListItemIcon>
								<ListItemText primary="Register"></ListItemText>
							</ListItem>
						</List>
					</Drawer>
				</div>
			);
	
		} else {
			return ( 
				<div>
					<IconButton aria-label="menu" onClick={this.openDrawer}>
						<MenuIcon />
					</IconButton>
					<Drawer open={this.state.openDrawer} onClose={this.closeDrawer}>
						<List className="menuDrawer">
							<ListItem component={Link} to="/app" button key="home" onClick={this.closeDrawer}>
								<ListItemIcon><HomeIcon></HomeIcon></ListItemIcon>
								<ListItemText primary="Home"></ListItemText>
							</ListItem>
							<ListItem component={Link} to="/friends" button key="friends" onClick={this.closeDrawer}>
								<ListItemIcon><EmojiPeopleIcon></EmojiPeopleIcon></ListItemIcon>
								<ListItemText primary="Friends" secondary={this.state.requestCount + " alert(s)"}></ListItemText>
							</ListItem>
							<ListItem button key="logout" onClick={this.logOut}>
								<ListItemIcon><ExitToAppIcon></ExitToAppIcon></ListItemIcon>
								<ListItemText primary="Log Out"></ListItemText>
							</ListItem>
						</List>
					</Drawer>
				</div>
			);
		}
	}
}

export default Menu;