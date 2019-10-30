import React, { Component } from 'react';
import Rebase from 're-base';
import firebase from 'firebase';
import app from '../../base';
import Courses from '../Courses/courses';
import Footer from '../Footer/Footer';
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
                        let fl = data[1][0];
                        let avURL = data[1];
                        //easiest way I could figure out to check for an upload avatar url
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
    updateInfo = ()=>{
        let userID = this.props.uid;
        let userRef = usersRef.child(userID);
        userRef.update({
            email: localStorage.getItem('email'),
            dname: localStorage.getItem('dname'),
            uid: localStorage.getItem('uid'),
            about: " ",
            shareEmailAddress: false,
            avatar: localStorage.getItem("avatar") === undefined?this.props.avatar === undefined?{}: this.props.avatar : localStorage.getItem("avatar")
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
        if((this.props.avatar !== null && this.props.avatar !== undefined) || (localStorage.getItem("avatar") !== null && localStorage.getItem("avatar") !== undefined)){
            base.fetch(`users/${ this.props.uid }`, {
                context: this,
                asArray: true
            }).then((data)=>{
                let length = data.length;
                if(length===0 || length===null || length === undefined) {
                    let userRef = usersRef.child(this.props.uid);
                    userRef.set({
                        email: localStorage.getItem('email'),
                        dname: localStorage.getItem('dname'),
                        uid: localStorage.getItem('uid'),
                        about: " ",
                        shareEmailAddress: false,
                        avatar: localStorage.getItem("avatar") || this.props.avatar
                    });
                }
            });
        }else{
            this.getImage();
            setTimeout(()=>{this.updateInfo()}, 2000);
        }
    }
    render(){   
        return (
            <div className="container">
                {this.props.header}
                <div className="content">
                    <h4>Available Courses</h4>
                    <Courses userID={this.props.uid} videos={ this.state.urls } courses = { this.state.courses } />
                </div>
                <Footer />                               
            </div>
        )
    }
}
export default Home;