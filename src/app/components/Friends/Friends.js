import React, { Component } from 'react';
import Footer from '../Footer/Footer';
import Rebase from 're-base';
import app from '../../base';
import UserDetails from '../UserDetails/UserDetails';
let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

class Friends extends Component {
    constructor(props){
        super(props);
        this.state={
            userId: this.props.userId,
            users: {},
            peopleListStyle: "people",
            general: true,
            specific: false,
            responseRequired: "fas fa-bell alert-main",
            outGoingRequests: [],
            inComingRequests: []
        }
    }
    componentWillMount(){
        base.fetch(`users`, {
            context: this,
            asArray: true
        }).then((data)=>{
            let length = data.length;
            if(length!==0 && length!==null) {
                this.setState({
                    users: data
                });
            }
        });
    }
    componentDidMount(){
        let userRef = usersRef.child(`${this.props.userId}/friends`);
        userRef.once('value').then((snapshot)=>{
            let uFriends = snapshot.val();
            if(uFriends !== null && uFriends !== undefined){
                this.setState({
                    friends: uFriends
                });
            }
        });
        let userRef1 = usersRef.child(`${this.props.userId}/friends`);
        userRef1.once('value').then((snapshot)=>{
            let outGoingRequests = [];
            let inComingRequests = [];
            snapshot.forEach((pFriend)=>{
                if(pFriend.val().direction === "outgoing" && pFriend.val().accepted === false){
                    outGoingRequests.push(pFriend.key);
                    this.setState({
                        outGoingRequests
                    })
                }else if(pFriend.val().direction === "incoming" && pFriend.val().accepted === false){
                    inComingRequests.push(pFriend.key);
                    this.setState({
                        inComingRequests
                    })
                }
            });
        });
    }
    backToUsers = ()=>{
        this.setState({
            general: true,
            specific: false,
            currUserId: null,
            currUserDname: null,
            currUserAvUrl: null,
            currUserAbout: null,
            currUserSharePref: null
        });
    }
    userDetail = (key)=>{
        let newUsers = {...this.state.users}
        this.setState({
            general: false,
            specific: true,
            currUserId: newUsers[key].uid,
            currUserDname: newUsers[key].dname,
            currUserAvUrl: newUsers[key].avatar,
            currUserEmail: newUsers[key].shareEmailAddress === true?newUsers[key].email:"Email Address is hidden",
            currUserAbout: newUsers[key].about,
            currUserSharePref: newUsers[key].shareEmailAddress
        });
    }
    changeResponseClass = ()=>{
        this.setState({
            responseRequired: ""
        });
    }
    incoming = (key)=>{
        let incoming = this.state.inComingRequests;
        let len = incoming.length;
        let count = 0;
        for(count; count < len; count++){
            let users = {...this.state.users};
            let currUser = users[key].uid;
            if(incoming[count] === currUser){
                return <span className={ this.state.responseRequired }></span>;
            }
        } 
    }
    getUsers = (key) => {
        let loggedInUser = this.state.userId;
        let users = {...this.state.users};
        let uCount = users.length;
        let userImg = users[key].avatar;
        let dname = users[key].dname;
        let userId = users[key].uid;
        if(uCount !== 0 && loggedInUser !== userId){
            return(
                <div title={ dname } id={ userId } key={key} className={ this.state.peopleListStyle } onClick={ ()=>{ this.userDetail(key) } }>
                    <div className="roundPic membersAv">
                        <img alt={ key } className="members" src={ userImg } />
                    </div>
                    <div className="pfriends">
                        { users[key].dname }
                        { this.incoming(key) }
                    </div>
                </div>
            )
        }
    }
    render(){
        if(this.state.general === true){
            return (
                <div className="Home">
                    <div className="container">
                        { this.props.header }
                        <div className="content">
                            <h4>Kilembe Users</h4>
                            <div className="sub-container">
                                { Object.keys(this.state.users).map(this.getUsers) }
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            )
        }else{
            return(
               <UserDetails
                 changeResponseClass = { this.changeResponseClass }
                 header = { this.props.header }
                 addFriendState = { this.state.addFriendState }
                 currUserSharePref = { this.state.currUserSharePref } 
                 currUserAbout = { this.state.currUserAbout } 
                 currUserEmail = { this.state.currUserEmail } 
                 currUserDname = { this.state.currUserDname } 
                 currUserAvUrl = { this.state.currUserAvUrl } 
                 currUserId={ this.state.currUserId } 
                 userId={ this.state.userId } 
                 backToUsers = { this.backToUsers } 
                 userDetail = { this.userDetail } />
            )
        } 
    }
}

export default Friends;