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
import { 
    Header,
    Footer 
} from 'components';
import './localStyles/main.css';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: #757575;
`;

class Messaging extends Component {
    state = {
        messaging: false
    }
    componentDidMount(){
        const { 
            confirmLoggedIn, 
            genInfo, 
            loginInfo,
            logingStatusConfirmation,
            openSocket
        } = this.props;
        logingStatusConfirmation(confirmLoggedIn, loginInfo, genInfo);
        const { socketOpen, unAuthorizedConnection } = loginInfo;
        if (!socketOpen && !unAuthorizedConnection) openSocket(this.props);
    }

    componentDidUpdate(){
        const { chatInfo: { onlineUsers }, friendsInfo: { friends, friendsFull } } = this.props
        let newFriendsFull = {...friendsFull};
        if ( onlineUsers && friends.length > 0 ) {
            Object.keys(onlineUsers).map( userOnline => {
                Object.keys(friendsFull).map( friend => {
                    if (userOnline === friend) {
                        newFriendsFull[friend].online = true;
                    }
                })
            })
            // console.log(newFriendsFull)
        }
    }


    displayFriends = key => {
        let { friendsInfo: { users, friendsFull } } = this.props;
        let online = friendsFull[key].online;
        let badgeClass = online ? 'fas fa-circle online' : 'fas fa-circle offline';
        if ( users.length > 0 ) {
            return <div key={key}> {
                users.map( obj => {
                    if (obj.uid === key) {
                        let { uid, avatar, dname, email } = obj;
                        // console.log(dname + ' ' + email)
                        return (
                            <div key={key} className="friend">
                                <div className="left">
                                    <div className="roundPic membersAv-small">
                                        <img alt={ uid } className="members" src = { avatar } />
                                    </div>
                                    <i className={badgeClass}></i>
                                    <div className="name">{ dname ? dname : email }</div>
                                    <div className="clear"></div>
                                </div>
                            </div>
                        )
                    }
                    return;
            }) }
            </div>
        }
        return;
    }

    render(){
        let { friendsInfo: { friends, fetchedFriends }, loginInfo: { socketError, socketOpen } } = this.props;
        let { messaging } = this.state;
        return (
            <div className="container Home">
                <Header />
                <div className="content">
                    <div className="messaging">
                        <div id='friends-list' className="friends">
                            <h3><FormattedMessage  id='friends.listTitle' /></h3>
                            { fetchedFriends ? 
                            friends && friends.length > 0 ? 
                            friends.map(val => this.displayFriends(val)) : 
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
                            { !messaging ? 
                            <span id='messaging-call-to-action'><FormattedMessage id={socketOpen ? 'friends.startConvo' : 'chat.noConnection'} /></span> :
                            <div></div> }
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
        getUsers: ()=>{
            dispatch(fetchUsers());
        },
        getFriends: info=>{
            dispatch(fetchFriends(info));
        },
        logingStatusConfirmation: (confirmLoggedIn, loginInfo, genInfo) => {
            dispatch(checkLoginStatus(confirmLoggedIn, loginInfo, genInfo));
        },
        openSocket: props => {
            dispatch(connectToChatServer(props));
        },
        confirmLoggedIn: () => {
            dispatch(loginConfirmed());
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
