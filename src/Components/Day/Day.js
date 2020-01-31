import React from 'react';
import './Day.css';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import 'moment/locale/nl'
import moment from 'moment';

class Day extends React.Component{

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
            todaysDate: moment().format('l'),
            tomorrowsDate: moment().add(1, 'days').calendar()
        }
    }

    renderCheckIn(){
        var newArray = []
        for(var i = 0; i < this.props.checkedIn.length; i++){
            var words = this.props.checkedIn[i].split(' ');
            if(this.props.date === words[1]){
                newArray[i] = words[0];
            }
        }
        if(newArray.length > 0){
            const listItem = newArray.map((name) =>
                <ListItemText key={name} primary={name}/>
            );
            return listItem;
        } else {
            return <span>No one can hang out yet</span>;
        }
        
    }

    render(){
        if(this.state.todaysDate === this.props.date){
            return(
                <div className="day">
                    <h1>Today</h1>
                    <List className="checkedInList">{this.renderCheckIn()}</List>
                </div>
            );
        } else if(this.state.tomorrowsDate === this.props.date) {
            return(
                <div className="day">
                    <h1>Tomorrow</h1>
                    <List className="checkedInList">{this.renderCheckIn()}</List>
                </div>
            );
        } else {
            return(
                <div className="day">
                    <h1>{this.props.day}, {this.props.date}</h1>
                    <List className="checkedInList">{this.renderCheckIn()}</List>
                </div>
            );
        }
    }
}

export default Day;