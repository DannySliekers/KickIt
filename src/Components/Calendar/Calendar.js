import React from 'react';
import './Calendar.css';
import Day from '../Day/Day';
import 'moment/locale/nl'
import moment from 'moment';
import Button from '@material-ui/core/Button';
import {IconButton} from '@material-ui/core';
import NextIcon from './next.png';
import BackIcon from './back.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Calendar extends React.Component{
    constructor(props){
        super(props);
        moment.updateLocale('nl', {
            calendar : {
                lastDay : 'l',
                sameDay : 'l',
                nextDay : 'l',
                lastWeek : 'l',
                nextWeek : 'l',
                sameElse : 'l'
            }
        });
        this.state = {
            data: [],
            day: new Date().getDay(),
            checkedIn: [],
            todaysDate: moment().format('l'),
            clickCounter: 0,
            username: ''
        }
    }

    componentDidMount(){
        this.getChillen();
        this.getUser();
    }

    getChillen = _ => {
        fetch('http://localhost:3000/api/getChillen')
            .then(response => response.json())
            .then(response => this.setState({data: response.data}, () =>{
                this.setChillings();
            }))
            .catch(err => console.error(err))
    }

    getUser = _ => {
        fetch('http://localhost:3000/api/getUser')
        .then(response => response.json())
        .then(response => this.setState({username: response.username}))
        .catch(err => console.error(err))
    }

    setChillings() {
        var newState = [];
        if(this.state.data){
            for(var i = 0; i < this.state.data.length; i++){
                newState[i] = this.state.data[i].personname + " " + this.state.data[i].date;
            }
        }
        this.setState({checkedIn: newState});
    }
  
    checkIn = _ => {
        let alreadyExists = false;
        var name = this.state.username + " " + this.state.todaysDate;
        for(var i = 0; i < this.state.checkedIn.length; i++){
            if (name === this.state.checkedIn[i]){
                alreadyExists = true
            }
        }

        if(!alreadyExists){
            const checkedIn = this.state.checkedIn;
            this.setState({checkedIn: checkedIn.concat(this.state.username + " " + this.state.todaysDate)}, () => {
                fetch('http://localhost:3000/api/chillen', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        users: this.state.checkedIn,
                    })
                });
            });
        }
        else {
            toast("You've already checked in");
        }
    }

    goNextDay = _ => {
        this.increaseDay();
        this.setState({
            clickCounter: this.state.clickCounter + 1 
        },() => {
            this.setState({todaysDate: moment().add(this.state.clickCounter, 'days').calendar()});
        });
    }

    goPreviousDay = _ =>  {
        if(moment().format('l') === this.state.todaysDate){
            
        } else {
            this.decreaseDay();
            this.setState({
                clickCounter: this.state.clickCounter - 1 
            },() => {
                this.setState({todaysDate: moment().add(this.state.clickCounter, 'days').calendar()});
            });
        }
    }

    increaseDay(){
        if(this.state.day === 6) {
            this.setState({day: 0})
        } else {
            this.setState({day: this.state.day + 1})
        }
    }

    decreaseDay(){
        if(this.state.day === 0) {
            this.setState({day: 6})
        } else {
            this.setState({day: this.state.day - 1})
        }
    }

    render(){
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return(
            <div className="Calendar">
                <IconButton onClick={this.goPreviousDay} className="backBtn">
                    <img className="backImg" src={BackIcon} alt="backicon" />
                </IconButton>
                <span className="margin">a</span>
                <IconButton onClick={this.goNextDay} className="nextBtn"> 
                    <img className="nextImg" src={NextIcon} alt="nexticon" />
                </IconButton>
                <Day day={days[this.state.day]} date={this.state.todaysDate} checkedIn={this.state.checkedIn}/>
                <Button variant="outlined" onClick={this.checkIn} className="checkinBtn">I'm available</Button>
            </div>
        );
    }
}



export default Calendar