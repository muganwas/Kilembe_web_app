import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ProfileImage } from 'components';
import axios from 'axios';
import Rebase from 're-base';
import app from '../../base';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

class Header extends Component {
    constructor(){
        super();
        this.state={
            dropDownStyle: null,
            arrStyle: null,
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
            updateGenInfo 
        } = this.props;
        let { info: { avURL } } = genInfo;
        let storedInfo = sessionStorage.getItem('genInfo');
            storedInfo = storedInfo?JSON.parse(storedInfo):null;
        //dispatch local storage genInfo to props
        if(storedInfo && !avURL){
            let newGenInfo = { ...genInfo };
            newGenInfo.info = { ...storedInfo };
            updateGenInfo(newGenInfo);
        }
        if(loggedIn){
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

    render(){
        const { info: { uid, dname }, logout, goTo } = this.props;
        const { 
            notificationClass, 
            homeStyle, 
            friendsStyle, 
            chatStyle, 
            menuStyle,
            arrStyle,
            dropDownStyle,
            settingsIconStyle,
            logoutIconStyle
        } = this.state;
        return (
            <div className="mainNav">
                <ProfileImage dname={ dname } userId = { uid } />     
                <div className="nav">    
                    <span className={ homeStyle } onClick={ ()=>goTo("/home") }></span>
                    <span className={ friendsStyle } onClick={ ()=>goTo("/friends") }><span className={ notificationClass }></span></span>
                    <span className={ chatStyle } onClick={ ()=>goTo("/messaging") }></span> 
                    <span className={ menuStyle } onClick={ this.showMenu }>
                        <div id="arr" className={ arrStyle }>
                            <ul id="menu" className={ dropDownStyle }>
                                <li className={ settingsIconStyle }>
                                    <span className="link" onClick={ ()=>goTo("/settings") } >Settings</span>
                                </li>
                                <li className={ logoutIconStyle }>
                                    <span className="logout" onClick={ ()=>logout() } >Logout</span>
                                </li>
                            </ul>
                        </div>
                    </span> 
                </div>
            </div>
        )
    }
}

Header.propTypes = {
    genInfo: PropTypes.object,
    info: PropTypes.object,
    logout: PropTypes.func.isRequired,
    goTo: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        info: state.genInfo.info
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateGenInfo: genInfo => {
            dispatch(dispatchedGenInfo(genInfo));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);