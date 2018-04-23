import React, { Component } from 'react';
import Footer from './Footer';
import Rebase from 're-base';
import app from '../base';
let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

class UserDetails extends Component {
    constructor(props){
        super(props);
        this.backToUsers = this.props.backToUsers;
        this.UserDetails = this.props.UserDetails;
        this.state = {
            friends: this.props.friends || {},
            addFriendState: "Add Friend",
        }
    }
    componentWillMount(){
        if(this.props.currUserId !== undefined){
            let userRef = usersRef.child(`${this.props.currUserId}/friends`);
            userRef.once('value').then((snapshot)=>{
                //console.log(snapshot.val());
                if(snapshot.val() !== null ){
                    let requestStatus = snapshot.val()[this.props.userId];
                    if(requestStatus !== undefined){
                        let preciseStatus = requestStatus["accepted"];
                        this.setState({
                            addFriendState: preciseStatus===true?"Friend":"Request Pending"
                        });
                    }
                }
            });
            base.syncState(`users/${this.props.userId}/friends`,{
                context: this,
                state: 'friends'
            });
        } 
    }
    sendFriendReq = (e)=>{
        let newFriend = e.target.id;
        let friends = {...this.props.friends};
        friends[newFriend] = { "direction" : "outgoing", "accepted": false };
        let userRef = usersRef.child(`${this.props.userId}/friends`);
        userRef.once('value').then((snapshot)=>{
            if(snapshot.val() !== null ){
                let requestStatus = snapshot.val()[this.props.currUserId];
                if(requestStatus !== undefined){
                    let userRef1 = usersRef.child(`${this.props.currUserId}/friends/${this.props.userId}`);
                    let userRef2 = usersRef.child(`${this.props.userId}/friends/${this.props.currUserId}`);
                    userRef1.remove();
                    userRef2.remove();
                    this.setState({
                        addFriendState: "Request revoked"
                    });
                }else{
                    this.setState({
                        friends: friends,
                        addFriendState: "Request Sent"
                    });
                    let userRef = usersRef.child(`${this.props.currUserId}/friends`);
                    userRef.once('value').then((snapshot)=>{
                        if(snapshot.val() === null ){
                            usersRef.child(`${this.props.currUserId}/friends`).set({
                                [this.props.userId]: {"direction" : "incoming", "accepted": false }
                            });
                        }else{
                            usersRef.child(`${this.props.currUserId}/friends`).update({
                                [this.props.userId]: {"direction" : "incoming", "accepted": false }
                            });
                        }
                    });
                }
            }else{
                this.setState({
                    friends: friends,
                    addFriendState: "Request Sent"
                });
                let userRef = usersRef.child(`${this.props.currUserId}/friends`);
                userRef.once('value').then((snapshot)=>{
                    if(snapshot.val() === null ){
                        usersRef.child(`${this.props.currUserId}/friends`).set({
                            [this.props.userId]: {"direction" : "incoming", "accepted": false }
                        });
                    }else{
                        usersRef.child(`${this.props.currUserId}/friends`).update({
                            [this.props.userId]: {"direction" : "incoming", "accepted": false }
                        });
                    }
                });
            }
        });
    }
    render(){
        return (
            <div className="Home">
                <div className="container">
                    { this.props.header }
                    <div className="content">
                        <div className="ficon icon-left-open-mini nav-button-container" onClick={ ()=>{ this.backToUsers()} }>
                            <span className="nav-button">Back</span>
                        </div>
                        <div className="currUserDits">
                            <div id="left">
                                <div className="roundPic membersAv"><img alt={ this.props.currUserDname } className="members" src={ this.props.currUserAvUrl } /></div>
                            </div>
                            <div id="center">
                                <div id="displayName">
                                    <div className="ficon nav-button-container icon-megaphone"><span>{ this.props.currUserDname }</span></div>  
                                </div>
                                <div id={ this.props.currUserEmail }>
                                    <div className="ficon nav-button-container icon-mail"><span>{ this.props.currUserEmail }</span></div> 
                                </div>
                                <div id="add-user">
                                    <div id={ this.props.currUserId } className="ficon nav-button-container icon-user-add" onClick={ this.sendFriendReq }><span id={ this.props.currUserId }>{this.state.addFriendState}</span></div> 
                                </div>
                            </div>
                            <div id="right">
                                <span className="icon-quote"></span>
                                <div id="about-me">{ this.props.currUserAbout }</div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}

export default UserDetails;