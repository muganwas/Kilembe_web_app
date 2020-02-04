import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { ScaleLoader } from 'react-spinners';
import { css } from '@emotion/core';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import { 
    confirmToken, 
    loginConfirmed, 
    logout, 
    checkLoginStatus 
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

//components
import MessagingNav from './MessagingNav';

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
        } = this.props;
        logingStatusConfirmation(confirmLoggedIn, loginInfo, genInfo); 
    }

    displayFriends = key => {
        let { friendsInfo: { users } } = this.props;
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
                                        <span className='fas fa-circle alert'></span>
                                    </div>
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
        let { friendsInfo: { friends, fetchedFriends } } = this.props;
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
                            <span id='messaging-call-to-action'><FormattedMessage id='friends.startConvo' /></span> :
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
    confirmUserToken: PropTypes.func.isRequired,
    updateGenInfo: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    getFriends: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        loginInfo: state.loginInfo,
        friendsInfo: state.friendsInfo
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
        confirmUserToken: userToken => {
            dispatch(confirmToken(userToken));
        },
        logingStatusConfirmation: (confirmLoggedIn, loginInfo, genInfo) => {
            dispatch(checkLoginStatus(confirmLoggedIn, loginInfo, genInfo));
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
