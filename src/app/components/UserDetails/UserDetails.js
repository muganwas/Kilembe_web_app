import React, { Component } from 'react';
import { 
    Header,
    Footer
} from 'components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from "react-intl";
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
import { Promise } from 'q';
let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

class UserDetails extends Component {

    state = {
        addFriendState: "users.friendRequest",
        fetched: false,
        selectedUserDispatched: false
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
            dispatchSelectedUser,
            getFriends
        } = this.props;
        const { info } = genInfo;
        const { uid } = info;
        logingStatusConfirmation(confirmLoggedIn, loginInfo, genInfo);
        const pathnameArr = pathname.split('/');
        const id = pathnameArr.pop();
        //console.log(users[id]) 
        const usersLength = Object.keys(users).length;
        if(usersLength === 0){
            getUsers();
            getFriends(info);
        }else{
            const selectedUser = users[id];
            const selectedUserId = selectedUser.uid;
            this.fetchFriends(selectedUserId, uid);
            dispatchSelectedUser(users, id);
            this.setState({selectedUserDispatched:true});
        }
    }

    componentDidUpdate(){
        const { direction, fetched, selectedUserDispatched } = this.state;
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
            this.fetchFriends(selectedUserId, uid);
        }
        if(!selectedUserDispatched && id && usersLength > 0){
            dispatchSelectedUser(users, id);
            this.setState({selectedUserDispatched:true});
        }
    }

    fetchFriends = (selectedUsersId, uid) => {
        this.fetchCurrentUsersFriendsInfo(selectedUsersId, uid)
        .then(res => {
            if(res === "fetched friends")
                this.fetchSelectedUsersFriendsInfo(selectedUsersId, uid);          
        })
    }

    fetchSelectedUsersFriendsInfo = (currUserId, userId) => {
        return new Promise((resolve, reject)=>{
            try{
                let userRef = usersRef.child(`${userId}/friends`);
                userRef.once('value').then((snapshot)=>{
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
                    resolve('fetched frineds');
                }, error=>{
                    console.log(error);
                    reject();
                });
            }catch(error){
                console.log(error);
                reject();
            }
        });
    }

    fetchCurrentUsersFriendsInfo(currUserId, userId){
        return new Promise((resolve, reject) => {
            try{
                let userRef = usersRef.child(`${currUserId}/friends`);
                userRef.once('value').then((snapshot)=>{
                    if(snapshot.val() !== null ){
                        let requestStatus = snapshot.val()[userId];
                        if(requestStatus !== undefined){
                            let preciseStatus = requestStatus["accepted"];
                            this.setState({
                                addFriendState: preciseStatus===true?
                                "users.unfriendUser":
                                "users.revokeFriendRequest",
                                fetched: true
                            });
                        }
                    }
                    resolve('friends fetched');
                }, error=>{
                    console.log(error);
                    reject();
                });
            }catch(error){
                console.log(error);
                reject();
            }
        })
    }

    syncCurrentUsersFriends = (userId) => {
        base.syncState(`users/${userId}/friends`,{
            context: this,
            state: 'friends'
        });
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
                addFriendState: "users.unfriendUser"
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
                addFriendState: "user.requestRejected"
            })
        }
    }
    respondOrRequest = ()=>{
        const { 
            direction, 
            friendRequestStatus, 
            addFriendState 
        } = this.state;
        const { 
            genInfo: { info: { uid } }
        } = this.props;
        if(direction === "incoming" && friendRequestStatus === false){
            return <div id={ uid } className="ficon icon-user-add">
                <span id="accept" className="respondB" onClick={ this.respondToIncoming }>
                    <FormattedMessage id={"users.acceptFriendRequest"} />
                </span>
                <span id="reject" className="respondB" onClick={ this.respondToIncoming }>
                    <FormattedMessage id={"users.rejectFriendRequest"} />
                </span>
            </div> 
        }else if( direction === "outgoing" && friendRequestStatus === false){
            return <div id={ uid } className="ficon nav-button-container icon-user-add" onClick={ this.sendFriendReq }>
                <span id={ uid }>
                    <FormattedMessage id={"users.pendingRequest"} />
                </span>
            </div>
        }else{
            return <div id={ uid } className="ficon nav-button-container icon-user-add" onClick={ this.sendFriendReq }>
                <span id={ uid }>
                    <FormattedMessage id={ addFriendState } />
                </span>
            </div> 
        }
    }
    sendFriendReq = (e)=>{
        const { genInfo: { info: {uid} }, friendsInfo: { selectedUser: { currUserId }, friends }  } = this.props;
        let newFriend = e.target.id;
        let friendsCopy = {...friends};
        friendsCopy[newFriend] = { "direction" : "outgoing", "accepted": false };
        let userRef = usersRef.child(`${uid}/friends`);
        userRef.once('value').then((snapshot)=>{
            if(snapshot.val() !== null ){
                let requestStatus = snapshot.val()[currUserId];
                if(requestStatus !== undefined){
                    let userRef1 = usersRef.child(`${currUserId}/friends/${uid}`);
                    let userRef2 = usersRef.child(`${uid}/friends/${currUserId}`);
                    userRef1.remove();
                    userRef2.remove();
                    this.setState({
                        addFriendState: "users.requestRevoked"
                    });
                }else{
                    this.setState({
                        friends: friendsCopy,
                        addFriendState: "users.requestSent"
                    });
                    let userRef = usersRef.child(`${currUserId}/friends`);
                    userRef.once('value').then((snapshot)=>{
                        if(snapshot.val() === null ){
                            usersRef.child(`${currUserId}/friends`).set({
                                [uid]: {"direction" : "incoming", "accepted": false }
                            });
                        }else{
                            usersRef.child(`${currUserId}/friends`).update({
                                [uid]: {"direction" : "incoming", "accepted": false }
                            });
                        }
                    });
                }
            }else{
                this.setState({
                    friends: friendsCopy,
                    addFriendState: "users.requestSent"
                });
                let userRef = usersRef.child(`${currUserId}/friends`);
                userRef.once('value').then((snapshot)=>{
                    if(snapshot.val() === null ){
                        usersRef.child(`${currUserId}/friends`).set({
                            [uid]: {"direction" : "incoming", "accepted": false }
                        });
                    }else{
                        usersRef.child(`${currUserId}/friends`).update({
                            [uid]: {"direction" : "incoming", "accepted": false }
                        });
                    }
                });
            }
        });
        this.syncCurrentUsersFriends(uid);
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