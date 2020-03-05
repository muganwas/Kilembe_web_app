import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ProfileImage } from 'components';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import {
    fetchUsers,
    fetchFriends,
    fetchFriendsRequests
} from 'reduxFiles/dispatchers/userDispatchers';
import {
    fetchedUsersOnline,
    dispatchRecievedMessage,
    fetchChatMessages
    //dispatchSentMessage
} from 'reduxFiles/dispatchers/chatDispatchers';
import { 
    logout, 
    loginConfirmed,
    setupUserInFirebase,
    connectToChatServer,
    disconnectFromChatServer,
    alertSocketError,
    socketConnected,
    socket,
    checkLoginStatus,
    confirmToken
} from 'reduxFiles/dispatchers/authDispatchers';
import { RECONNECT_TIMER } from 'misc/constants';

class Header extends Component {
    constructor(){
        super();
        this.state={
            dropDownStyle: null,
            arrStyle: null,
            loginStyle: "menu icon icon-home",
            homeStyle: "menu icon icon-youtube-alt",
            friendsStyle: "menu icon icon-torsos-all",
            chatStyle: "menu icon icon-comments",
            menuStyle: "menu icon icon-menu",
            settingsIconStyle: "small icon-settings",
            logoutIconStyle: "small icon-logout",
            notificationClass: "fas fa-circle alert hidden",
            friendAction: false,
            onlineUsers: null
        }
        this.reconnectTimer = null;
    }

    componentDidMount(){
        const { 
            info: { loggedIn }, 
            genInfo, 
            updateGenInfo,
            confirmLoggedIn,
            loginInfo,
            friendsInfo: { inComingRequests, fetchedFriends },
            dispatchSocketConnected,
            openSocket,
        } = this.props;
        const { socketOpen, unAuthorizedConnection } = loginInfo;
        const { info: { avURL, uid, chatkitUser: { token }  }, fetched } = genInfo;
        const { notificationClass } = this.state;
        
        //dispatch local storage genInfo to props
        if (!loggedIn) {
            let storedInfo = localStorage.getItem('genInfo');
            storedInfo = storedInfo?
            JSON.parse(storedInfo):
            null;
            if (!avURL && storedInfo) {
                confirmLoggedIn();
                updateGenInfo(storedInfo);
            }
        } 
        else {
            // console.log(friendsFetched + ' ' + fetched)
            if (fetched) this.setUpFriendsInfo();
        }
        if (fetchedFriends && inComingRequests.length > 0 && notificationClass.includes('hidden')) this.setState({notificationClass:"fas fa-circle alert"});

        socket.on('connect', () => {
            const { genInfo: { info: { uid, chatkitUser: { token } } } } = this.props;
            if ( token && uid ) {
                socket.emit('authentication', {
                    token,
                    uid
                });
                dispatchSocketConnected();
            }
            else {
                const storedGen = JSON.parse(localStorage.getItem('genInfo'));
                const { uid, chatkitUser: { token } } = storedGen;
                if ( token && uid ) {
                    socket.emit('authentication', {
                        token,
                        uid
                    });
                    dispatchSocketConnected();
                }
            }
        });

        socket.on('authorized', reason => {
            const { genInfo: { info: { uid, chatkitUser: { token } } }, fetchChats } = this.props;
            fetchChats(uid, token);
            console.log(reason.message)
        })
        
        socket.on('unauthorized', reason => {
            const { dispatchSocketError, signOut } = this.props;
            // console.log('Unauthorized:', reason);
            dispatchSocketError(reason);
            signOut();
        });
        
        socket.on('disconnect', reason => {
            let { dispatchSocketError, dispatchUsersOnline } = this.props;
            dispatchUsersOnline({});
            dispatchSocketError(reason);
        });
        
        socket.on("join-alert", data => {
            const { dispatchUsersOnline } = this.props;
            dispatchUsersOnline(data);
            console.log('You connected');
        });
    
        socket.on("chat-message", data => {
            const { chatInfo: { messages }, storeRecievedMessages } = this.props;
            const { sender } = data;
            let newMessages = Object.assign({}, messages);
            const messagesWithSender = newMessages[sender];
            const messagesWithSenderLength = messagesWithSender ? messagesWithSender.length : 0;
            // console.log(data);
            if (messagesWithSenderLength > 0) {
                const prevMessages = [...newMessages[sender]];
                const prevMessage = prevMessages.pop();
                if (JSON.stringify(prevMessage) === JSON.stringify(data)) console.log('repeated msg')
                else newMessages[sender].push(data);
            }
            else newMessages[sender] = [data];
            storeRecievedMessages(newMessages);
            //do something when message recieved
        });
    
        socket.on("user-disconnected", data => {
            console.log('user disconnected');
            const { dispatchUsersOnline } = this.props;
            dispatchUsersOnline(data);
        });
    
        socket.on("user-connected", data => {
            const { dispatchUsersOnline } = this.props;
            dispatchUsersOnline(data);
        });
        if (!socketOpen && !unAuthorizedConnection && token && uid) openSocket(this.props);
    }

    setUpFriendsInfo = () =>  {
        const { 
            genInfo: { 
                info,
                userInDatabase
            }, 
            friendsInfo: { fetched, fetchedFriends },
            getUsers, 
            getFriends,
            getFriendsRequests,
            uploadUsersInfoToFB,
        } = this.props;
        let { uid, avURL } = info;
        if (!fetched) getUsers();
        if (!fetchedFriends) {
            getFriends(info);
            getFriendsRequests(info);
        }
        !userInDatabase ? uploadUsersInfoToFB(avURL, uid) : null ;
    }

    componentDidUpdate(){
        const {
            loginInfo: { loggedIn, socketOpen, unAuthorizedConnection },
            genInfo: { fetched },
            friendsInfo: { fetchedFriends, inComingRequests },
            openSocket
        } =this.props;
        const { notificationClass } = this.state;
        if (!loggedIn) this.goTo("/");
        else if (fetched) this.setUpFriendsInfo();
        
        // show nofication icon if there are incoming requests
        if (fetchedFriends && inComingRequests.length > 0 && notificationClass.includes('hidden')) this.setState({notificationClass:"fas fa-circle alert"});
        else if (fetchFriends && inComingRequests.length === 0 && !notificationClass.includes('hidden')) this.setState({notificationClass:"fas fa-circle alert hidden"});
        
        if (loggedIn && !socketOpen && !unAuthorizedConnection) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = setTimeout(() => {
                console.log('trying to reconnect...');
                openSocket(this.props);
            }, RECONNECT_TIMER);
        } 
        else clearTimeout(this.reconnectTimer);
    }

    showMenu = () => {
        var menu = this.state.dropDownStyle;
        if ( menu !== "visible"){
            this.setState({
                dropDownStyle: "visible",
                arrStyle: "visible"
            });
        }
        else {
            this.setState({
                dropDownStyle: null,
                arrStyle: null
            });
        }
    }

    goTo = (location) => {
        const { history } = this.props;
        history.push(location);
    } 

    render(){
        const { info: { uid, dname }, signOut, genInfo, loginInfo } = this.props;
        const { loggedIn } = loginInfo;
        const { 
            notificationClass,
            loginStyle, 
            homeStyle, 
            friendsStyle, 
            chatStyle, 
            menuStyle,
            arrStyle,
            dropDownStyle,
            settingsIconStyle,
            logoutIconStyle
        } = this.state;
        const notFoundPath = loggedIn?
        "/home":
        "/";
        return (
            <div className="mainNav">
                { loggedIn ? 
                <ProfileImage dname={ dname } userId = { uid } />:
                null }    
                { loggedIn ?
                <div className="nav">    
                    <span className={ homeStyle } onClick={ () => this.goTo("/home") }></span>
                    <span className={ friendsStyle } onClick={ () => this.goTo("/friends") }>
                        <span className={ notificationClass }></span>
                    </span>
                    <span className={ chatStyle } onClick={ () => this.goTo("/messaging") }></span> 
                    <span className={ menuStyle } onClick={ this.showMenu }>
                        <div id="arr" className={ arrStyle }>
                            <ul id="menu" className={ dropDownStyle }>
                                <li className={ settingsIconStyle }>
                                    <span className="link" onClick={ () => this.goTo("/settings") } >Settings</span>
                                </li>
                                <li className={ logoutIconStyle }>
                                    <span className="logout" onClick={ () => signOut(genInfo, this.goTo) } >Logout</span>
                                </li>
                            </ul>
                        </div>
                    </span> 
                </div> :
                <div>
                    <span className={ loginStyle } onClick={ () => this.goTo(notFoundPath) }></span>
                </div> }
            </div>
        )
    }
}

Header.propTypes = {
    genInfo: PropTypes.object,
    info: PropTypes.object,
    loginInfo: PropTypes.object,
    friendsInfo: PropTypes.object,
    chatInfo: PropTypes.object,
    confirmLoggedIn: PropTypes.func.isRequired,
    updateGenInfo: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    dispatchUsersOnline: PropTypes.func.isRequired,
    getUsers: PropTypes.func,
    openSocket: PropTypes.func,
    closeSocket: PropTypes.func,
    confirmUserToken: PropTypes.func,
    logingStatusConfirmation: PropTypes.func,
    dispatchSocketConnected: PropTypes.func,
    dispatchSocketError: PropTypes.func,
    getFriends: PropTypes.func,
    getFriendsRequests: PropTypes.func,
    uploadUsersInfoToFB: PropTypes.func,
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        info: state.genInfo.info,
        loginInfo: state.loginInfo,
        friendsInfo: state.friendsInfo,
        chatInfo: state.chatInfo
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUsers: ()=>{
            dispatch(fetchUsers());
        },
        openSocket: props => {
            dispatch(connectToChatServer(props));
        },
        closeSocket: () => {
            dispatch(disconnectFromChatServer());
        },
        confirmUserToken: userToken => {
            dispatch(confirmToken(userToken));
        },
        logingStatusConfirmation: (confirmLoggedIn, loginInfo, genInfo) => {
            dispatch(checkLoginStatus(confirmLoggedIn, loginInfo, genInfo));
        },
        dispatchSocketConnected: () => {
            dispatch(socketConnected());
        },
        dispatchSocketError: error => {
            dispatch(alertSocketError(error));
        },
        getFriends: info => {
            dispatch(fetchFriends(info));
        },
        getFriendsRequests: info => {
            dispatch(fetchFriendsRequests(info));
        },
        uploadUsersInfoToFB: (avatar, uid) => {
            dispatch(setupUserInFirebase(avatar, uid));
        },
        updateGenInfo: genInfo => {
            dispatch(dispatchedGenInfo(genInfo));
        },
        confirmLoggedIn: () => {
            dispatch(loginConfirmed());
        },
        signOut: genInfo => {
            dispatch(logout(genInfo));
        },
        dispatchUsersOnline: users => {
            dispatch(fetchedUsersOnline(users));
        },
        storeRecievedMessages: message => {
            dispatch(dispatchRecievedMessage(message));
        },
        fetchChats: (sender, token) => {
            dispatch(fetchChatMessages(sender,token));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));