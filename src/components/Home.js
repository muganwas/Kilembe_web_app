import React, { Component } from 'react';
import Rebase from 're-base';
import firebase from 'firebase';
import app from '../base';
import Courses from './courses';
import Footer from './Footer';
let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');
var storage = firebase.storage();
var storageRef = storage.ref();

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            courses: {}
        };
    }
    getImage = ()=>{
        return new Promise((resolve, reject)=>{
            let userId = this.props.uid;
            base.fetch(`users/${ userId }`, {
                context: this,
                asArray: true,
                then(data){
                    let len = data.length;
                    if( len !== 0){
                        let fl = data[0][0];
                        let avURL = data[0];
                        if(fl === "h"){
                            this.setState({
                            avatar: avURL
                            });
                            localStorage.setItem('avatar', avURL);
                        }else{
                            storageRef.child('general/avatar.jpg').getDownloadURL().then((data)=>{
                            this.setState({
                                avatar: data,
                            });
                            localStorage.setItem('avatar', data);
                            });
                        }
                    }else{
                        storageRef.child('general/avatar.jpg').getDownloadURL().then((data)=>{
                            this.setState({
                                avatar: data,
                            });
                            localStorage.setItem('avatar', data);
                        }); 
                    }
                }
            });
        });
    }
    postInfo = ()=>{
        let userID = this.props.uid;
        let userRef = usersRef.child(userID);
        userRef.set({
            email: localStorage.getItem('email'),
            dname: localStorage.getItem('dname'),
            uid: localStorage.getItem('uid'),
            avatar: localStorage.getItem("avatar")
        });
    }
    componentDidMount(){
        var currUser = app.auth().currentUser;
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
                    currentUser: JSON.stringify(currUser),
                    courses: courses,
                    urls: videos
                }); 
            } 
        });        
    }
    componentWillMount(){
        const userID = this.props.uid;
        const avatar = this.props.avatar;
        const storAv = localStorage.getItem("avatar");
        if((avatar !== null && avatar !== undefined) || (storAv !== null && storAv!== undefined)){
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
                        uid: localStorage.getItem('uid'),
                        avatar: localStorage.getItem("avatar") || avatar
                    });
                }
            });
        }else{
            this.getImage();
            setTimeout(()=>{this.postInfo()}, 2000);
        }
    }
    render(){   
        return (
            <div className="container">
                {this.props.header}
                <div className="content">
                <div id="paypal-button"></div>
                <div className="clear"></div>
                    <div className="clear"></div>
                    <div className="left-col">
                        <div className="courses">
                            <h4>Available Courses</h4>
                            <Courses userID={this.props.uid} videos={ this.state.urls } courses = { this.state.courses } />
                        </div>
                    </div>
                </div>
                <Footer />                               
            </div>
        )
    }
}
export default Home;