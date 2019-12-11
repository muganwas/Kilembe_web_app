import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
    ChatManager, 
    TokenProvider 
} from '@pusher/chatkit';
import { 
    Header,
    Footer 
} from 'components';
import Rebase from 're-base';
import app from '../../base';
import './css/main.css';
import axios from 'axios';

//components
import MessagingNav from './MessagingNav';

const usersRef = app.database().ref('users');
const base = Rebase.createClass(app.database());
var chatManager;

class Messaging extends Component {
    componentDidMount(){
        const { 
            confirmLoggedIn, 
            genInfo, 
            loginInfo,
            logingStatusConfirmation 
        } = this.props
        const { info: { fetched } } = genInfo;
        logingStatusConfirmation(confirmLoggedIn, loginInfo, genInfo);
        //console.log(friendsInfo);
        if(fetched)
            this.setupChatKit();        
    }

    componentDidUpdate(){
        const { 
            genInfo: { 
                info, 
                fetched 
            }, 
            getUsers, 
            getFriends, 
            friendsInfo 
        } = this.props;
        const friendsFetched = friendsInfo.fetched;
        /**Fetch users and frineds if they're not fetched yet */
        if(!friendsFetched && fetched){
            getUsers();
            getFriends(info);
            this.setupChatKit();
        }
    }

    setupChatKit = () => {
        const { 
            genInfo: { 
                info
            }
        } = this.props;
        //const friendsFetched = friendsInfo.fetched;
        const { dname, uid } = info;
        base.fetch(`users/${ uid }/chatkit_uid`, {
            context: this,
            asArray: false
        }).then((data)=>{
            console.log(data)
            let len = Object.keys(data).length;
            if(len === 0){
                let url = process.env.CHATKIT_CREATE_USER + uid + "&name="+ dname;
                axios(url)
                .then((res)=>{
                    let chatkit_id = res.data.id;
                    usersRef.child(uid).update({
                        chatkit_uid: chatkit_id
                    });
                })
                .catch((err)=>{
                    console.log(err.message);
                });
            }else{
                let url = process.env.CHATKIT_TOKEN_PROVIDER + data;
                chatManager = new ChatManager({
                    instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
                    userId: data,
                    tokenProvider: new TokenProvider({ url })
                });
                chatManager.connect()
                .then(currentUser => {
                    console.log('Successful connection', currentUser)
                })
                .catch(err => {
                    console.log('Error on connection', err)
                });
            }
        });
    }

    displayFriends = (key)=>{
        let friends = this.props.genInfo.info.friends;
        let uid = friends[key].key;
        let avatar = friends[key].avatar;
        let allUsers= this.props.allUsers;
        let dname;
        allUsers? dname = allUsers[uid].dname: dname = null;
        return (
            <div key={key} className="friend">
                <div className="left">
                    <div className="roundPic membersAv">
                        <img alt={ uid } className="members" src = { avatar } />
                    </div>
                    <div className="name">{ dname?dname:null }</div>
                    <div className="clear"></div>
                </div>
            </div>
        )
    }

    render(){
        let friends = { ...this.props.genInfo.info.friends };
        return(
            <div className="container Home">
                <Header />
                <div className="content">
                    { this.props.header }
                    <div className="messaging">
                        <div className="friends">
                            <h3>Friends</h3>
                            { friends?Object.keys(friends).map(this.displayFriends):null }
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
