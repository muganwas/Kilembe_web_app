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
    fetchedUsersOnline
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
    confirmToken
} from 'reduxFiles/dispatchers/authDispatchers';
// import { setChatId } from '../../misc/functions';

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
    }

    componentDidMount(){
        const { 
            info: { loggedIn }, 
            genInfo, 
            updateGenInfo,
            confirmLoggedIn,
            loginInfo: { socketOpen, unAuthorizedConnection },
            friendsInfo: { inComingRequests, fetchedFriends },
            dispatchSocketConnected,
            openSocket
        } = this.props;
        let { info: { avURL, uid, chatkitUser: { token }  }, fetched } = genInfo;
        let { notificationClass } = this.state;
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
        
        socket.on('unauthorized', reason => {
            const { dispatchSocketError } = this.props;
            console.log('Unauthorized:', reason);
            dispatchSocketError(reason);
        });
        
        socket.on('disconnect', reason => {
            let { dispatchSocketError, dispatchUsersOnline, genInfo: { info: { uid, chatkitUser: { token }  } } } = this.props;
            if ( reason === 'io server disconnect' && token && uid ) {
                console.log('useless server');
            }
            dispatchUsersOnline({});
            dispatchSocketError(reason);
        });
        
        socket.on("join-alert", data => {
            const { dispatchUsersOnline } = this.props;
            dispatchUsersOnline(data);
        });
    
        socket.on("chat-message", data =>{
            const { name, message } = data;
            //do something when message recieved
        });
    
        socket.on("user-disconnected", data => {
            console.log('user disconnected');
            const { dispatchUsersOnline } = this.props;
            dispatchUsersOnline(data);
        });
    
        socket.on("user-connected", data => {
            //do something when user connects
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
            uploadUsersInfoToFB 
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
            genInfo: { fetched, info: { uid, chatkitUser: { token } } },
            friendsInfo: { fetchedFriends, inComingRequests },
            openSocket
        } =this.props;
        const { notificationClass } = this.state;
        if (!loggedIn) this.goTo("/");
        else if (fetched) this.setUpFriendsInfo();
        // show nofication icon if there are incoming requests
        if (fetchedFriends && inComingRequests.length > 0 && notificationClass.includes('hidden')) this.setState({notificationClass:"fas fa-circle alert"});
        else if (fetchFriends && inComingRequests.length === 0 && !notificationClass.includes('hidden')) this.setState({notificationClass:"fas fa-circle alert hidden"});
        
        if (!socketOpen && !unAuthorizedConnection && token && uid) openSocket(this.props);
    }

    showMenu = ()=>{
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
                { loggedIn? 
                <ProfileImage dname={ dname } userId = { uid } />:
                null }    
                { loggedIn?
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
                </div>:
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
    confirmLoggedIn: PropTypes.func.isRequired,
    updateGenInfo: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    dispatchUsersOnline: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        info: state.genInfo.info,
        loginInfo: state.loginInfo,
        friendsInfo: state.friendsInfo
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
        dispatchSocketConnected: () => {
            dispatch(socketConnected());
        },
        dispatchSocketError: error => {
            dispatch(alertSocketError(error))
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));