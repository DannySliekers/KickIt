import React from 'react';
import './Friends.css';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Friends extends React.Component {
    constructor() {
        super();
        this.state = {
            friendList: [],
            search: "",
            suggestedUsers: [],
            requestList: []
        }
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    componentDidMount(){
        this.renderAll();
    }

    getFriends = () => {
        fetch('http://localhost:3000/api/getFriends')
        .then(response => response.json())
        .then(response => this.setState({friendList: response.data}))
        .catch(err => console.error(err))
    }

    getRequests = () => {
        fetch('http://localhost:3000/api/getRequests')
        .then(response => response.json())
        .then(response => this.setState({requestList: response.data}))
        .catch(err => console.error(err))
    }

    renderRequests() {
        if(this.state.requestList.length > 0){
            const listItems = this.state.requestList.map((index) => 
            <ListItem key={index.requestid} button>
                <ListItemText primary={index.username}></ListItemText>
                <ListItemSecondaryAction>
                    <IconButton aria-label="accept" onClick={() => this.acceptRequest(index.requestid, index.userid)}>
                        <CheckIcon className="acceptIcon" />
                    </IconButton>
                    <IconButton aria-label="reject" onClick={() => this.rejectRequest(index.requestid)}>
                        <ClearIcon className="rejectIcon"  />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            );
            return listItems;
        } else {
            return <p>No friend requests</p>
        }
        
    }

    renderFriends() {
        if(this.state.friendList.length > 0){
            const listItems = this.state.friendList.map((index) => 
            <ListItemText key={index.username} primary={index.username} />
            );
            return listItems;
        } else {
            return <p>No friends yet :(</p>
        }
        
    }

    onSearchChange(e){
        if(e.target.value.length > 0){
            var regex = RegExp(/^$|^[a-zA-Z0-9]+$/i);
            if(regex.test(e.target.value)){
                this.setState({search: e.target.value}, () => {
                    fetch('http://localhost:3000/api/searchuser', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            search: this.state.search,
                        })
                    })
                    .then(response => response.json())
                    .then(response => this.setState({suggestedUsers: response.data}))
                });
            }
        } else {
            this.setState({suggestedUsers: []});
        }
    }

    sendFriendRequest = (userId, username) => {
        let alreadyFriend = false;
        let alreadyRequest = false;
        for (let i = 0; i < this.state.friendList.length; i++) {
            if(username === this.state.friendList[i].username)
            {
                alreadyFriend = true;
            }
        }
        for (let i = 0; i < this.state.requestList.length; i++) {
            if(username === this.state.requestList[i].username)
            {
                alreadyRequest = true;
            }
        }
        if(!alreadyFriend && !alreadyRequest){
            fetch('http://localhost:3000/api/sendFriendRequest', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    toUser: userId,
                })
            }).then(response => {
                if(response.status === 401){
                    toast("You've already sent a friend request to this user!");
                } else {
                    toast("Friend request sent");
                }
            })
        }else if(alreadyFriend) {
            toast("You're already friends with this user!");
        } else if(alreadyRequest) {
            toast("This user already sent you a friend request!");
        }
        
    }

    acceptRequest = (requestid, userid) => {
        fetch('http://localhost:3000/api/acceptFriendRequest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requestid: requestid,
                userid: userid
            })
        }).then(this.renderAll())
    }

    rejectRequest = (requestid) => {
        fetch('http://localhost:3000/api/rejectFriendRequest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requestid: requestid
            })
        }).then(this.renderAll())
    }

    renderSuggestedUsers(){
        const listItems = this.state.suggestedUsers.map((user) =>
        <ListItem key={user.userid} button>
            <ListItemText primary={user.username}></ListItemText>
            <ListItemSecondaryAction>
                <IconButton aria-label="add" onClick={() => this.sendFriendRequest(user.userid, user.username)}>
                    <AddIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
        );
        return listItems
    }

    renderAll(){
        this.getFriends();
        this.getRequests();
    }

    render(){
        return(
            <div>
                <hr></hr>
                <h2>Friends ({this.state.friendList.length})</h2>
                <List className="friendList">{this.renderFriends()}</List>
                <hr></hr>
                <h3>Friend requests ({this.state.requestList.length})</h3>
                <List className="requestList">{this.renderRequests()}</List>
                <hr></hr>
                <h3>Search for user</h3>
                <TextField onChange={this.onSearchChange} className="searchField" id="standard-basic" label="Search" variant="outlined" />
                <List className="suggestedUserList">{this.renderSuggestedUsers()}</List>
                <hr></hr>
            </div>
        )
    }
}

export default Friends;