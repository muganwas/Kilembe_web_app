import React, { Component } from 'react';
import { 
    Header,
    Footer,
    KLoader
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
    changeResponseClass,
    pushSelectedUser
} from 'reduxFiles/dispatchers/userDispatchers';
import { 
    loginConfirmed, 
    checkLoginStatus 
} from 'reduxFiles/dispatchers/authDispatchers';

const base = Rebase.createClass(app.database());
const usersRef = app.database().ref('users');

class UserDetails extends Component {

    state = {
        addFriendState: "users.friendRequest",
        fetched: false,
        selectedUserDispatched: false,
        direction: null
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
        logingStatusConfirmation(confirmLoggedIn, loginInfo, genInfo);
        const pathnameArr = pathname.split('/');
        const id = pathnameArr.pop();
        const usersLength = Object.keys(users).length;
        if(usersLength === 0){
            getUsers();
        }else{
            getFriends(info);
            dispatchSelectedUser(users, id);
            this.setState({selectedUserDispatched:true});
        }
    }

    componentDidUpdate(){
        const { 
            direction, 
            selectedUserDispatched 
        } = this.state;
        const { 
            history: { location: { pathname } },
            friendsInfo: { users, fetchedFriends, friendsFull },
            genInfo: { info },
            getFriends,
            dispatchSelectedUser
        } = this.props;
        const requestInfoFetched = this.state.fetched;
        const { uid } = info;
        const usersLength = Object.keys(users).length;
        const pathnameArr = pathname.split('/');
        const id = pathnameArr.pop();
        if(!direction && !fetchedFriends && usersLength > 0 && uid){
            getFriends(info);
        }
        if(!selectedUserDispatched && id && usersLength > 0){
            dispatchSelectedUser(users, id);
            this.setState({selectedUserDispatched:true});
        }
        if(!requestInfoFetched && fetchedFriends && friendsFull){
            this.fetchCurrentUsersFriendsInfo()
            this.fetchSelectedUsersFriendsInfo();
        }
    }

    fetchCurrentUsersFriendsInfo = () => {
        return new Promise((resolve, reject)=>{
            const { friendsInfo: { friendsFull, selectedUser: { currUserId } } } = this.props;
            try{
                const friendRequest = friendsFull[currUserId]
                if(friendRequest){
                    let preciseStatus = friendRequest.accepted;
                    let direction = friendRequest.direction;
                    // console.log(direction)
                    this.setState({
                        friendRequestStatus: preciseStatus,
                        direction
                    });
                }
                resolve('CUF fetched');
            }catch(error){
                console.log(error);
                reject();
            }
        });
    }

    fetchSelectedUsersFriendsInfo(){
        return new Promise((resolve, reject) => {
            const { genInfo: { info: { uid } }, friendsInfo: { selectedUser: { currUsersFriends } } } = this.props;
            try{
                const currentUserFriendship = currUsersFriends?
                currUsersFriends[uid]:
                null;
                if(currentUserFriendship){
                    let requestStatus = currentUserFriendship.accepted;
                    if(requestStatus !== undefined && requestStatus !== null){
                        this.setState({
                            addFriendState: requestStatus===true?
                            "users.unfriendUser":
                            "users.revokeFriendRequest",
                            fetched: true
                        });
                    }
                }
                resolve('SUF fetched');
            }catch(error){
                console.log(error);
                reject();
            }
        });
    }

    syncCurrentUsersFriends = userId => {
        base.syncState(`users/${userId}/friends`,{
            context: this,
            state: 'friends'
        });
    }

    respondToIncoming = e => {
        let clicked = e.target.id;
        const { 
            genInfo: { info }, 
            friendsInfo: { selectedUser: { currUserId } },
            changeResponse,
            getFriendsRequests,
            getFriends
        } = this.props;
        let { uid } = info;
        if(clicked === "accept"){
            let userRef = usersRef.child(`${ uid }/friends`);
            userRef.child(`${currUserId}`).update({
                "direction": "incoming",
                "accepted" : true
            });
            let userRef1 = usersRef.child(`${currUserId}/friends`);
            userRef1.child(`${uid}`).update({
                "direction": "outgoing",
                "accepted" : true
            });
            changeResponse();
            this.setState({
                friendRequestStatus: true,
                addFriendState: "users.unfriendUser"
            })
        }else if(clicked === "reject"){
            let userRef1 = usersRef.child(`${currUserId}/friends/${uid}`);
            let userRef2 = usersRef.child(`${uid}/friends/${currUserId}`);
            userRef1.remove();
            userRef2.remove();
            changeResponse();
            this.setState({
                direction: null,
                friendRequestStatus: null,
                addFriendState: "user.requestRejected"
            });
        }
        getFriendsRequests(info);
        getFriends(info);
    }
    respondOrRequest = () => {
        const { 
            direction, 
            friendRequestStatus, 
            addFriendState 
        } = this.state;
        const { 
            friendsInfo: { 
                selectedUser 
            }
        } = this.props;
        const { currUserId } = selectedUser;
        //console.log(uid)
        //console.log(currUsersFriends)
        if(direction === "incoming" && friendRequestStatus === false){
            return <div id={ currUserId } className="ficon icon-user-add">
                <span id="accept" className="respondB" onClick={ this.respondToIncoming }>
                    <FormattedMessage id={"users.acceptFriendRequest"} />
                </span>
                <span id="reject" className="respondB" onClick={ this.respondToIncoming }>
                    <FormattedMessage id={"users.rejectFriendRequest"} />
                </span>
            </div> 
        }else if( direction === "outgoing" && friendRequestStatus === false){
            return <div id={ currUserId } className="ficon nav-button-container icon-user-add" onClick={ this.sendFriendReq }>
                <span id={ currUserId }>
                    <FormattedMessage id={"users.pendingRequest"} />
                </span>
            </div>
        }else{
            return <div id={ currUserId } className="ficon nav-button-container icon-user-add" onClick={ this.sendFriendReq }>
                <span id={ currUserId }>
                    <FormattedMessage id={ addFriendState } />
                </span>
            </div> 
        }
    }

    sendFriendReq = e => {
        const { 
            genInfo: { info }, 
            friendsInfo: { selectedUser: { currUserId }, friendsFull },
            getFriendsRequests,
            getFriends
        } = this.props;
        let {uid} = info;
        let newFriend = e.target.id;
        let friendsCopy = {...friendsFull};
        const currentUsersFrinedsRef = usersRef.child(`${uid}/friends`);
        currentUsersFrinedsRef.once('value').then(snapshot => {
            if (snapshot.val() !== null ) {
                let requestStatus = snapshot.val()[currUserId];
                // console.log(requestStatus)
                if (requestStatus) {
                    let userRef1 = usersRef.child(`${currUserId}/friends/${uid}`);
                    let userRef2 = usersRef.child(`${uid}/friends/${currUserId}`);
                    delete friendsCopy[newFriend];
                    userRef1.remove();
                    userRef2.remove();
                    this.setState({
                        friends: friendsCopy,
                        addFriendState: "users.requestRevoked"
                    });
                }
                else {
                    friendsCopy[newFriend] = { "direction" : "outgoing", "accepted": false };
                    this.setState({
                        friends: friendsCopy,
                        addFriendState: "users.requestSent"
                    });
                    let selectedUsersFriendsRef = usersRef.child(`${currUserId}/friends`);
                    selectedUsersFriendsRef.once('value').then(snapshot => {
                        if(snapshot.val() === null ){
                            selectedUsersFriendsRef.set({
                                [uid]: {"direction" : "incoming", "accepted": false }
                            });
                        }else{
                            selectedUsersFriendsRef.update({
                                [uid]: {"direction" : "incoming", "accepted": false }
                            });
                        }
                    });
                }
            }else{
                friendsCopy[newFriend] = { "direction" : "outgoing", "accepted": false };
                this.setState({
                    friends: friendsCopy,
                    addFriendState: "users.requestSent"
                });
                let userRef = usersRef.child(`${currUserId}/friends`);
                userRef.once('value').then((snapshot)=>{
                    if(snapshot.val() === null ){
                        usersRef.set({
                            [uid]: {"direction" : "incoming", "accepted": false }
                        });
                    }else{
                        usersRef.update({
                            [uid]: {"direction" : "incoming", "accepted": false }
                        });
                    }
                });
            }
            getFriendsRequests(info);
            getFriends(info)
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
        const { friendsInfo: { 
            defaultAvatar,
            selectedUser: {
                    currUserAvUrl,
                    currUserDname,
                    currUserEmail,
                    currUserAbout
                } 
            } 
        } = this.props;
        let userImg = currUserAvUrl || defaultAvatar;
        const aboutLength = currUserAbout ? currUserAbout.length : 0;
        return (
            <div className="container Home">
                <Header />
                <div className="content">
                    <div className="ficon icon-left-open-mini nav-button-container" onClick={ ()=>{ this.backToUsers()} }>
                        <span className="nav-button">Back</span>
                    </div>
                    { 
                        currUserDname ?
                        <div className="currUserDits">
                            <div id="left">
                                <div className="roundPic membersAv">
                                    <img alt={ currUserDname } className="members" src={ userImg } />
                                </div>
                            </div>
                            <div id="center">
                                <div id="displayName">
                                    <div className="ficon nav-button-container icon-megaphone">
                                        <span>{ currUserDname }</span>
                                    </div>  
                                </div>
                                <div id={ currUserEmail }>
                                    <div className="ficon nav-button-container icon-mail">
                                        <span>{ currUserEmail }</span>
                                    </div> 
                                </div>
                                <div id="add-user">
                                    { this.respondOrRequest() }
                                </div>
                            </div>
                            <div id="right">
                                { aboutLength < 1 ? <span className="icon-quote"></span> :
                                <div id="about-me">{`"${currUserAbout} "`}</div> }
                            </div>
                        </div>:
                        <KLoader 
                            type="TailSpin"
                            color="#757575"
                            height={50}
                            width={50}
                        />
                    }
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
        getUsers: () => {
            dispatch(fetchUsers());
        },
        getFriends: info => {
            dispatch(fetchFriends(info));
        },
        changeResponse: () => {
            dispatch(changeResponseClass());
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