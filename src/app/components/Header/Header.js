import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ProfileImage } from 'components';
import axios from 'axios';
import Rebase from 're-base';
import app from '../../base';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import { logout, loginConfirmed, } from 'reduxFiles/dispatchers/authDispatchers';

let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

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
            friendAction: false
        }
    }

    componentDidMount(){
        const { 
            info: { uid, loggedIn }, 
            genInfo, 
            updateGenInfo,
            confirmLoggedIn
        } = this.props;
        let { info: { avURL } } = genInfo;
        //dispatch local storage genInfo to props
        if(!loggedIn){
            let storedInfo = sessionStorage.getItem('genInfo');
            storedInfo = storedInfo?
            JSON.parse(storedInfo):
            null;
            let newGenInfo = { ...genInfo };
            newGenInfo.info = { ...storedInfo };
            if(!avURL && storedInfo){
                confirmLoggedIn();
                updateGenInfo(newGenInfo);
            }
        }else{
            this.createChatKitUser();
            let userRef = usersRef.child(`${uid}/friends`);
            userRef.once('value').then((snapshot)=>{
                snapshot.forEach((itemSnapshot)=>{
                    //let itemKey= itemSnapshot.key;
                    let itemVal= itemSnapshot.val();
                    if(itemVal.direction === "incoming" && itemVal.accepted === false){
                        this.setState({
                            friendAction: true,
                            notificationClass: "fas fa-circle alert"
                        });
                    }
                });
            });
        }
    }

    createChatKitUser = () => {
        let { genInfo: { fetched }, userId, dname } = this.props;
        let uid = userId;
        if(fetched === true){
            base.fetch(`users/${ uid }/chatkit_uid`, {
                context: this,
                asArray: false
            }).then((data)=>{
                let len = Object.keys(data).length;
                if(len === 0){
                    let url = process.env.CHATKIT_CREATE_USER + userId + "&name="+ dname;
                    axios(url)
                    .then((res)=>{
                        let chatkit_id = res.data.id;
                        usersRef.child(uid).update({
                            chatkit_uid: chatkit_id
                        });
                    })
                    .catch((err)=>{
                        console.log(err)
                    });
                }
            });
        }
    }

    showMenu = ()=>{
        var menu = this.state.dropDownStyle;
        if( menu !== "visible"){
            this.setState({
                dropDownStyle: "visible",
                arrStyle: "visible"
            });
        }else{
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
                    <span className={ homeStyle } onClick={ ()=>this.goTo("/home") }></span>
                    <span className={ friendsStyle } onClick={ ()=>this.goTo("/friends") }>
                        <span className={ notificationClass }></span>
                    </span>
                    <span className={ chatStyle } onClick={ ()=>this.goTo("/messaging") }></span> 
                    <span className={ menuStyle } onClick={ this.showMenu }>
                        <div id="arr" className={ arrStyle }>
                            <ul id="menu" className={ dropDownStyle }>
                                <li className={ settingsIconStyle }>
                                    <span className="link" onClick={ ()=>this.goTo("/settings") } >Settings</span>
                                </li>
                                <li className={ logoutIconStyle }>
                                    <span className="logout" onClick={ ()=>signOut(genInfo, this.goTo) } >Logout</span>
                                </li>
                            </ul>
                        </div>
                    </span> 
                </div>:
                <div>
                    <span className={ loginStyle } onClick={ ()=>this.goTo(notFoundPath) }></span>
                </div> }
            </div>
        )
    }
}

Header.propTypes = {
    genInfo: PropTypes.object,
    info: PropTypes.object,
    signOut: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        info: state.genInfo.info,
        loginInfo: state.loginInfo
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateGenInfo: genInfo => {
            dispatch(dispatchedGenInfo(genInfo));
        },
        confirmLoggedIn: () => {
            dispatch(loginConfirmed());
        },
        signOut: genInfo => {
            dispatch(logout(genInfo));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));