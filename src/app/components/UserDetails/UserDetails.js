import React, { Component } from 'react';
import { 
    Header,
    Footer
} from 'components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Rebase from 're-base';
import app from '../../base';
import {
    fetchUsers,
    fetchFriends,
    fetchFriendsRequests,
    pushSelectedUser
} from 'reduxFiles/dispatchers/userDispatchers';
import { 
    loginConfirmed, 
    checkLoginStatus 
} from 'reduxFiles/dispatchers/authDispatchers';
let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

class UserDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            addFriendState: "Add Friend",
            fetched: false
        }
    }
    componentDidMount(){        
        const { 
            history: { location: { pathname } }, 
            friendsInfo: { users }, 
            getUsers,
            confirmLoggedIn, 
            genInfo, 
            loginInfo, 
            logingStatusConfirmation,
            dispatchSelectedUser
        } = this.props;

        logingStatusConfirmation(confirmLoggedIn, loginInfo, genInfo);
        const pathnameArr = pathname.split('/');
        const id = pathnameArr.pop();
        //console.log(users[id]) 
        const usersLength = Object.keys(users).length;
        if(usersLength === 0){
            getUsers();
        }else{
            this.fetchUserFriendDetails();
            dispatchSelectedUser(users, id);
        }
    }

    componentDidUpdate(){
        const { direction, fetched } = this.state;
        const { 
            history: { location: { pathname } },
            friendsInfo: { users },
            genInfo: { info: { uid } },
            dispatchSelectedUser
        } = this.props;
        const usersLength = Object.keys(users).length;
        const pathnameArr = pathname.split('/');
        const id = pathnameArr.pop();
        if(!direction && !fetched && usersLength > 0 && uid){
            const selectedUser = users[id];
            const selectedUserId = selectedUser.uid;
            this.fetchUserFriendDetails(selectedUserId, uid);
        }
    }

    fetchUserFriendDetails = (currUserId, userId) => {
        let userRef = usersRef.child(`${currUserId}/friends`);
        let userRef1 = usersRef.child(`${userId}/friends`);
        userRef1.once('value').then((snapshot)=>{
            if(snapshot.val() !== null ){
                let requestStatus = snapshot.val()[currUserId];
                if(requestStatus !== undefined){
                    let preciseStatus = requestStatus["accepted"];
                    let direction = requestStatus["direction"];
                    this.setState({
                        friendRequestStatus: preciseStatus,
                        direction: direction
                    });
                }
            }
        });
        userRef.once('value').then((snapshot)=>{
            if(snapshot.val() !== null ){
                let requestStatus = snapshot.val()[userId];
                if(requestStatus !== undefined){
                    let preciseStatus = requestStatus["accepted"];
                    this.setState({
                        addFriendState: preciseStatus===true?"UnFriend":"Revoke Request",
                        fetched: true
                    });
                }
            }
        });
        /*base.syncState(`users/${userId}/friends`,{
            context: this,
            state: 'friends'
        });*/
    }

    respondToIncoming = (e)=>{
        let clicked = e.target.id;
        if(clicked === "accept"){
            let userRef = usersRef.child(`${this.props.userId}/friends`);
            userRef.child(`${this.props.currUserId}`).update({
                "direction": "incoming",
                "accepted" : true
            });
            let userRef1 = usersRef.child(`${this.props.currUserId}/friends`);
            userRef1.child(`${this.props.userId}`).update({
                "direction": "outgoing",
                "accepted" : true
            });
            (this.props.changeResponseClass)();
            this.setState({
                friendRequestStatus: true,
                addFriendState: "UnFriend"
            })
        }else if(clicked === "reject"){
            let userRef1 = usersRef.child(`${this.props.currUserId}/friends/${this.props.userId}`);
            let userRef2 = usersRef.child(`${this.props.userId}/friends/${this.props.currUserId}`);
            userRef1.remove();
            userRef2.remove();
            (this.props.changeResponseClass)();
            this.setState({
                direction: null,
                friendRequestStatus: null,
                addFriendState: "Rejected"
            })
        }
    }
    respondOrRequest = ()=>{
        if(this.state.direction === "incoming" && this.state.friendRequestStatus === false){
            return <div id={ this.props.currUserId } className="ficon icon-user-add">
                <span id="accept" className="respondB" onClick={ this.respondToIncoming }>
                    Accept
                </span>
                <span id="reject" className="respondB" onClick={ this.respondToIncoming }>
                    Reject
                </span>
            </div> 
        }else{
            return <div id={ this.props.currUserId } className="ficon nav-button-container icon-user-add" onClick={ this.sendFriendReq }>
                <span id={ this.props.currUserId }>
                    {this.state.addFriendState}
                </span>
            </div> 
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

    backToUsers = () => {
        this.goTo('/friends');
    }

    goTo = (location) => {
        const { history } = this.props;
        history.push(location);
    }

    render(){
        const { friendsInfo: { selectedUser: {
            currUserAvUrl,
            currUserDname,
            currUserEmail,
            currUserAbout
        } } } = this.props;
        return (
            <div className="container Home">
                <Header />
                <div className="content">
                    <div className="ficon icon-left-open-mini nav-button-container" onClick={ ()=>{ this.backToUsers()} }>
                        <span className="nav-button">Back</span>
                    </div>
                    <div className="currUserDits">
                        <div id="left">
                            <div className="roundPic membersAv"><img alt={ this.props.currUserDname } className="members" src={ currUserAvUrl } /></div>
                        </div>
                        <div id="center">
                            <div id="displayName">
                                <div className="ficon nav-button-container icon-megaphone"><span>{ currUserDname }</span></div>  
                            </div>
                            <div id={ this.props.currUserEmail }>
                                <div className="ficon nav-button-container icon-mail"><span>{ currUserEmail }</span></div> 
                            </div>
                            <div id="add-user">
                                { this.respondOrRequest() }
                            </div>
                        </div>
                        <div id="right">
                            <span className="icon-quote"></span>
                            <div id="about-me">{ currUserAbout }</div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

UserDetails.propTypes = {
    friendsInfo: PropTypes.object.isRequired,
    loginInfo: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired,
    getUsers: PropTypes.func.isRequired,
    logingStatusConfirmation: PropTypes.func.isRequired,
    confirmLoggedIn: PropTypes.func.isRequired,
    dispatchSelectedUser: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        friendsInfo: state.friendsInfo,
        loginInfo: state.loginInfo,
        genInfo: state.genInfo
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUsers: ()=>{
            dispatch(fetchUsers());
        },
        getFriends: info=>{
            dispatch(fetchFriends(info));
        },
        dispatchSelectedUser: (users, id) => {
            dispatch(pushSelectedUser(users, id));
        },
        logingStatusConfirmation: (confirmLoggedIn, loginInfo, genInfo) => {
            dispatch(checkLoginStatus(confirmLoggedIn, loginInfo, genInfo));
        },
        confirmLoggedIn: () => {
            dispatch(loginConfirmed());
        },
        getFriendsRequests: info => {
            dispatch(fetchFriendsRequests(info));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserDetails));