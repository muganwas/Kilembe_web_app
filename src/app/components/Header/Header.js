import React, { Component } from 'react';
import { View, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ProfileImage } from 'components';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import {
    fetchUsers,
    fetchFriends,
    fetchFriendsRequests,
    fetchUserInfoFromDB
} from 'reduxFiles/dispatchers/userDispatchers';
import {
    fetchedUsersOnline,
    dispatchRecievedMessage,
    fetchChatMessages
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
import { Button } from 'components';
import { 
    mdiYoutube, 
    mdiAccountGroup, 
    mdiForumOutline, 
    mdiMenu, 
    mdiAccountCogOutline,
    mdiLogout,
    mdiHome
} from '@mdi/js';
import styles from './styling/styles';
import arrow from 'styles/images/upArrow.png';

class Header extends Component {
    constructor(){
        super();
        this.state={
            invitationAlert: false,
            friendAction: false,
            onlineUsers: null,
            showDropDownMenu: false
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
            dbUserInfo,
            fetchCurrentUserInfoFromDB
        } = this.props;
        const { socketOpen, unAuthorizedConnection } = loginInfo;
        const { info: { avURL, uid, chatkitUser: { token }  }, fetched } = genInfo;
        
        //dispatch local storage genInfo to props
        if (!loggedIn) {
            let storedInfo = localStorage.getItem('genInfo');
            storedInfo = storedInfo ?
            JSON.parse(storedInfo) :
            null;
            if (!avURL && storedInfo) {
                confirmLoggedIn();
                updateGenInfo(storedInfo);
            }
        } 
        else {
            // console.log(friendsFetched + ' ' + fetched)
            const dbUserInfoFetched = dbUserInfo.fetched;
            if(!dbUserInfoFetched && uid) fetchCurrentUserInfoFromDB(uid);
            if (fetched) this.setUpFriendsInfo();
        }
        if (fetchedFriends && inComingRequests.length > 0 && !this.state.invitationAlert) this.setState({invitationAlert: true});

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
                if (JSON.stringify(prevMessage) === JSON.stringify(data)) console.log('repeated msg');
                else newMessages[sender].push(data);
            }
            else newMessages[sender] = [data];
            storeRecievedMessages(newMessages);
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
            genInfo: { 
                info: { uid },
                fetched 
            },
            friendsInfo: { fetchedFriends, inComingRequests },
            openSocket,
            dbUserInfo,
            fetchCurrentUserInfoFromDB
        } =this.props;
        const { invitationAlert } = this.state;
        if (!loggedIn) this.goTo("/");
        else if (fetched) this.setUpFriendsInfo();
        
        // show nofication icon if there are incoming requests
        if (fetchedFriends && inComingRequests.length > 0 && !invitationAlert) {
            this.setState({invitationAlert: true});
        }
        else if (fetchFriends && inComingRequests.length === 0 && invitationAlert) this.setState({invitationAlert:false});
        
        if (loggedIn) { 
            const dbUserInfoFetched = dbUserInfo.fetched;
            if(!dbUserInfoFetched && uid) fetchCurrentUserInfoFromDB(uid);
            if (!socketOpen && !unAuthorizedConnection) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = setTimeout(() => {
                    console.log('trying to reconnect...');
                    openSocket(this.props);
                }, RECONNECT_TIMER);
            }
        } 
        else clearTimeout(this.reconnectTimer);
    }

    toggleMenu = () => {
        var visible = this.state.showDropDownMenu;
        this.setState({showDropDownMenu: !visible});
    }

    goTo = (location) => {
        const { history } = this.props;
        history.push(location);
    } 

    render(){
        const { info: { uid, dname }, signOut, genInfo, loginInfo } = this.props;
        const { loggedIn } = loginInfo;
        const { 
            invitationAlert,
            showDropDownMenu
        } = this.state;
        const notFoundPath = loggedIn ?
        "/home":
        "/";
        return (
            <View style={styles.mainNavigation}>
                { loggedIn ? 
                <ProfileImage dname={ dname } userId = { uid } /> :
                null }    
                { loggedIn ?
                <View style={styles.nav}> 
                    <Button
                        style={styles.navButtonStyle}
                        hoveredColor='#FDD906'
                        iconPath={mdiYoutube}
                        iconColor='white'
                        onPress={() => this.goTo('/home')}
                        size={1}
                    />
                    <Button
                        style={styles.navButtonStyle}
                        hoveredColor='#FDD906'
                        iconPath={mdiAccountGroup}
                        notification={invitationAlert}
                        notificationStyle={styles.alert}
                        iconColor='white'
                        onPress={() => this.goTo('/friends')}
                        size={1}
                    /> 
                    <Button
                        style={styles.navButtonStyle}
                        hoveredColor='#FDD906'
                        iconPath={mdiForumOutline}
                        iconColor='white'
                        onPress={() => this.goTo("/messaging")}
                        size={1}
                    />
                    <Button
                        style={styles.navButtonStyle}
                        hoveredColor='#FDD906'
                        iconPath={mdiMenu}
                        iconColor='white'
                        onPress={this.toggleMenu}
                        size={1}
                    />  
                    { showDropDownMenu ? 
                    <View style={styles.dropdownContainer}>
                        <ImageBackground style={styles.dropdownMenuBackgroundImage} source={arrow} />
                        <View style={styles.dropdown}>
                            <View style={styles.dropdownItem}>
                                <Button
                                    style={styles.dropdownMenuButtons}
                                    hoveredStyle={styles.dropdownMenuButtonsHovered}
                                    iconPath={mdiAccountCogOutline}
                                    textStyle={styles.dropdownMenuTextStyle}
                                    iconColor={'black'}
                                    text='Settings'
                                    onPress={() => this.goTo("/settings")}
                                    size={0.7}
                                /> 
                            </View>
                            <View style={styles.dropdownMenuSplitter} />
                            <View id='logout' style={styles.dropdownItem}>
                                <Button
                                    style={styles.dropdownMenuButtons}
                                    hoveredStyle={styles.dropdownMenuButtonsHovered}
                                    iconPath={mdiLogout}
                                    textStyle={styles.dropdownMenuTextStyle}
                                    iconColor={'black'}
                                    text='Logout'
                                    onPress={() => signOut(genInfo, this.goTo)}
                                    size={0.7}
                                />
                            </View>
                        </View>
                    </View> : 
                    null }
                </View> :
                <Button
                    style={styles.navButtonStyle}
                    hoveredColor='#FDD906'
                    iconPath={mdiHome}
                    iconColor={'white'}
                    onPress={() => this.goTo(notFoundPath)}
                    size={1}
                />
                }
            </View>
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
    fetchCurrentUserInfoFromDB: PropTypes.func
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        info: state.genInfo.info,
        loginInfo: state.loginInfo,
        friendsInfo: state.friendsInfo,
        chatInfo: state.chatInfo,
        dbUserInfo: state.userInfo
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
        },
        fetchCurrentUserInfoFromDB: uid => {
            dispatch(fetchUserInfoFromDB(uid));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));