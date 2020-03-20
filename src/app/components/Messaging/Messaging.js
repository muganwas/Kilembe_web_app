import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { ScaleLoader } from 'react-spinners';
import { css } from '@emotion/core';
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
    Footer 
} from 'components';
import './styling/main.css';
import ChatComponent from './ChatComponent';
import { 
    isMobile, 
    isSmallMobile,
    isTab,
    shortName, 
    nameTooLong, 
    firstLetters 
} from 'misc/helpers';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: #757575;
`;

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

    displayChatComponent = e => {
        e.stopPropagation();
        const { selectUserToChat } = this.props;
        const { id } = e.target;
        selectUserToChat(id);
    }

    displayFriends = key => {
        const { friendsInfo: { users, friendsFull }, chatInfo: { onlineUsers, selectedUser } } = this.props;
        const online = onlineUsers && onlineUsers[key] ? true : false;
        const badgeClass = online ? 'fas fa-circle online' : 'fas fa-circle offline';
        const { isMobile, isSmallMobile } = this.state

        if ( users.length > 0 ) {
            return (
            <div key={key}> {
                users.map( obj => {
                    if (obj.uid === key && friendsFull[key].accepted) {
                        let { uid, avatar, dname, email } = obj;
                        /*console.log(dname + ' ' + email)*/
                        const nameToDisplay = dname ? 
                            isMobile || nameTooLong(dname) ? 
                            shortName(dname) : 
                            dname : 
                            email;
                        
                        return (
                            <div key={key} id={key} onClick={this.displayChatComponent} className="friend">
                                <div id={key} className="left-col">
                                    <div id={key} className="roundPic-users membersAv-small">
                                        <img id={key} alt={ uid } className="members" src = { avatar } />
                                    </div>
                                    <i className={badgeClass}></i>
                                    <div id={key} className="name">{ selectedUser && isMobile || isSmallMobile ? firstLetters(nameToDisplay) : nameToDisplay }</div>
                                </div>
                            </div>
                        )
                    }
                    return;
                }) }
            </div>)
        }
        return;
    }

    render(){
        let { friendsInfo: { friends, fetchedFriends }, loginInfo: { socketOpen }, chatInfo: { selectedUser } } = this.props;
        const { isMobile, isSmallMobile } = this.state;
        return (
            <div className="container Home">
                <Header />
                <div className="content">
                    <div className="messaging">
                        <div id='friends-list' className={ selectedUser && isMobile || isSmallMobile ? "friends-mini" : "friends"}>
                            <h3><FormattedMessage  id='friends.listTitle' /></h3>
                            { fetchedFriends ? 
                            friends && friends.length > 0 ? 
                            friends.map(this.displayFriends) : 
                            <div className='messages'>
                                <FormattedMessage id='message.noFriendsYet' />
                            </div> :
                            <ScaleLoader
                                css={override}
                                sizeUnit={"px"}
                                height={10}
                                width={3}
                                radius={3}
                                color={'#757575'}
                                loading={!fetchedFriends} 
                            /> }
                        </div>
                        <div id='conversation-container'>
                            { !selectedUser ? 
                            <span id='messaging-call-to-action'><FormattedMessage id={socketOpen ? 'friends.startConvo' : 'chat.noConnection'} /></span> :
                            <ChatComponent /> }
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
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
