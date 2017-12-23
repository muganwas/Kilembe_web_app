import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Rebase from 're-base';
import app from '../base';
import Courses from './courses';
let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

class Home extends Component {
    constructor(){
        super();
        this.state = {
            courses: {}
        };
    }
    componentWillMount(){
        var courses = [];
        var videos = [];
        base.fetch(`courses`, {
            context: this,
            asArray: true
        }).then((info)=>{
            let length = info.length; 
            if(length!==0 && length!=null) {
                for(var count =0; count<length; count++){
                    let course = info[count]['Course_Title'];
                    let vidUrl = info[count]['Video']
                    courses[count] = course;
                    videos[count] = vidUrl;
                }
                this.setState({
                    courses: courses,
                    urls: videos
                }); 
            } 
        });
        const userID = this.props.uid;
        base.fetch(`users/${ userID }`, {
            context: this,
            asArray: true
        }).then((data)=>{
            let length = data.length;
            if(length!==0 && length!==null) {
                let kTitle = ['dname', 'uid', 'email'];
                for(var count =0; count<length; count++){
                    base.syncState(`users/${ userID }/${kTitle[count]}`, {
                        context: this,
                        state: `${kTitle[count]}`
                    });
                }
            }
        });          
    }
    render(){  
        const userID = this.props.uid;
        base.fetch(`users/${ userID }`, {
            context: this,
            asArray: true
        }).then((data)=>{
            let length = data.length;
            if(length===0 || length===null) {
                let userRef = usersRef.child(userID);
                userRef.set({
                    email: localStorage.getItem('email'),
                    dname: localStorage.getItem('dname'),
                    uid: localStorage.getItem('uid')
                });
            }
        });
        return (
            <div className="container">
                {this.props.header}
                <div className="content">
                <div className="avator"></div>
                <div id="paypal-button"></div>
                <div className="clear"></div>
                    <span id="welcome">You are Home, { this.state.dname || this.props.dname }!</span>
                    <div className="left-col">
                        <div className="courses">
                            <h4>Available Courses</h4>
                            <Courses userID={this.props.uid} videos={ this.state.urls } courses = { this.state.courses } />
                        </div>
                    </div>
                </div>
                <div className="swagg">A React Single Page Application by <Link to="https://www.upwork.com/freelancers/~01edb2b7356420e161">Muganwas</Link></div>                
            </div>
        )
    }
}

export default Home;