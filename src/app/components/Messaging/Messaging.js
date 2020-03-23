import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import { 
    loginConfirmed, 
    logout, 
    checkLoginStatus,
    connectToChatServer
} from 'reduxFiles/dispatchers/authDispatchers';
import {
    fetchUsers,
    fetchFriends
} from 'reduxFiles/dispatchers/userDispatchers';
import { setUserToChat } from 'reduxFiles/dispatchers/chatDispatchers';
import { 
    Header,
    Footer,
    Scaleloader,
    KLoader
} from 'components';
import ChatComponent from './ChatComponent';
import { 
    isMobile, 
    isSmallMobile,
    isTab,
    shortName, 
    nameTooLong, 
    firstLetters 
} from 'misc/helpers';
import mainStyles from 'styles/mainStyles';
import styles from './styling/styles';

class Messaging extends Component {
    state = {
        isMobile: isMobile(),
        isSmallMobile: isSmallMobile(),
        tab: isTab()
    }
    componentDidMount(){
        const { 
            confirmLoggedIn,
            loginInfo,
            logingStatusConfirmation,
            openSocket,
            genInfo
        } = this.props;
        logingStatusConfirmation(confirmLoggedIn, loginInfo, genInfo);
        const { socketOpen, unAuthorizedConnection } = loginInfo;
        if (!socketOpen && !unAuthorizedConnection) openSocket(this.props);
        
        // reevaluate device size on resize
        window.onresize = () => {
            const width = window.innerWidth;
            this.setState({
                isMobile: isMobile(width),
                isSmallMobile: isSmallMobile(width),
                tab: isTab(width)
            });
        }
    }

    displayChatComponent = id => {
        const { selectUserToChat } = this.props;
        selectUserToChat(id);
    }

    displayFriends = key => {
        const { friendsInfo: { users, friendsFull }, chatInfo: { onlineUsers, selectedUser } } = this.props;
        const online = onlineUsers && onlineUsers[key] ? true : false;
        const badgeStyle = online ? styles.userOnline : styles.userOffline;
        const { isMobile, isSmallMobile } = this.state;
        const activeUser = String(key) === String(selectedUser);
        if ( users.length > 0 ) {
            return (
                <View key={key}> 
                    {
                        users.map(obj => {
                            if (obj.uid === key && friendsFull[key].accepted) {
                                let { uid, avatar, dname, email } = obj;
                                /*console.log(dname + ' ' + email)*/
                                const nameToDisplay = dname ? 
                                    isMobile || nameTooLong(dname) ? 
                                    shortName(dname) : 
                                    dname : 
                                    email;
                                
                                return (
                                    <TouchableOpacity key={key} onPress={() => this.displayChatComponent(key)} style={activeUser ? styles.friendActive : styles.friend}>
                                        <View id={key} style={styles.leftCol}>
                                            <View id={key} style={styles.avatarContainer}>
                                                <Image id={key} alt={ uid } style={styles.avatar} source = { avatar } />  
                                            </View>
                                            <View style={badgeStyle}></View>
                                            <Text id={key} style={styles.name}>{ selectedUser && isMobile || isSmallMobile ? firstLetters(nameToDisplay) : nameToDisplay }</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        }) 
                    }
                </View>
            )
        }
        return;
    }

    render(){
        let { friendsInfo: { friends, fetchedFriends }, loginInfo: { socketOpen }, chatInfo: { selectedUser } } = this.props;
        const { isMobile, isSmallMobile, tab } = this.state;
        const mainContainerStyle = isMobile ? 
        mainStyles.mainContainerMobi : 
        tab ? 
        mainStyles.mainContainerTab : 
        mainStyles.mainContainer;
        return (
            <View style={mainContainerStyle}>
                <Header />
                <View style={isMobile ? mainStyles.contentMobi : mainStyles.content}>
                    <Text style={mainStyles.title}><FormattedMessage id="friends.pageTitle"/></Text>
                    { fetchedFriends ?
                    <View style={mainStyles.messaging}>
                        <View  
                            style={ 
                                selectedUser && isMobile || selectedUser && tab || isSmallMobile ? 
                                mainStyles.friendsListMobi : 
                                tab || isMobile ? 
                                mainStyles.friendsListTab :
                                mainStyles.friendsList
                            }
                        >
                            { fetchedFriends ? 
                            friends && friends.length > 0 ? 
                            friends.map(this.displayFriends) : 
                            <Text style={styles.messages}>
                                <FormattedMessage id='message.noFriendsYet' />
                            </Text> :
                            <Scaleloader
                                height={10}
                                width={3}
                                radius={3}
                                color={'#757575'}
                                borderColor={'#757575'}
                                loading={!fetchedFriends} 
                            /> }
                        </View>
                        <View style={styles.conversationContainer}>
                            { 
                                !selectedUser ? 
                                <View style={styles.messagingCallToAction}>
                                    <FormattedMessage id={socketOpen ? 'friends.startConvo' : 'chat.noConnection'} />
                                </View> :
                                <ChatComponent /> 
                            }
                        </View>
                    </View> :
                    <KLoader 
                        type="TailSpin"
                        color="#757575"
                        height={50}
                        width={50}
                    /> }
                </View>
                <Footer />
            </View>
        )
    }

}

Messaging.propTypes = {
    genInfo: PropTypes.object.isRequired,
    loginInfo: PropTypes.object.isRequired,
    friendsInfo: PropTypes.object.isRequired,
    updateGenInfo: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    getFriends: PropTypes.func.isRequired,
    chatInfo: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        loginInfo: state.loginInfo,
        friendsInfo: state.friendsInfo,
        chatInfo: state.chatInfo
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
        logingStatusConfirmation: (confirmLoggedIn, loginInfo, info) => {
            dispatch(checkLoginStatus(confirmLoggedIn, loginInfo, info));
        },
        openSocket: props => {
            dispatch(connectToChatServer(props));
        },
        confirmLoggedIn: () => {
            dispatch(loginConfirmed());
        },
        selectUserToChat: userId => {
            dispatch(setUserToChat(userId))
        },
        signOut: genInfo => {
            dispatch(logout(genInfo));
        },
        updateGenInfo: genInfo => {
            dispatch(dispatchedGenInfo(genInfo));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messaging);
