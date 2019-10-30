import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProfileImage from '../ProfileImage/ProfileImage';
import axios from 'axios';
import Rebase from 're-base';
import app from '../../base';
let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

@connect((store)=>{
    return {
        genInfo: store.genInfo,
        info: store.genInfo.info
    }
})
class Header extends Component {
    constructor(props){
        super(props);
        this.state={
            userId: this.props.userId,
            dname: this.props.dname,
            home: this.props.home,
            appUsers: this.props.appUsers,
            messaging: this.props.messaging,
            settings: this.props.settings,
            logout: this.props.logout,
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
    componentWillMount(){
        let userRef = usersRef.child(`${this.props.userId}/friends`);
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

    componentDidMount(){
        //check if setup for messaging
        let fetched = this.props.genInfo.fetched;
        let uid = this.props.userId;
        if(fetched === true){
            base.fetch(`users/${ uid }/chatkit_uid`, {
                context: this,
                asArray: false
            }).then((data)=>{
                let len = Object.keys(data).length;
                if(len === 0){
                    let url = process.env.CHATKIT_CREATE_USER + this.props.userId + "&name="+ this.props.dname;
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
        return (
            <div className="mainNav">
                <ProfileImage dname={ this.state.dname } userId = { this.state.userId } />     
                <div className="nav">    
                    <span className={ this.state.homeStyle } onClick={ this.state.home }></span>
                    <span className={ this.state.friendsStyle } onClick={ this.state.appUsers }><span className={ this.state.notificationClass }></span></span>
                    <span className={ this.state.chatStyle } onClick={ this.state.messaging }></span> 
                    <span className={ this.state.menuStyle } onClick={ this.showMenu }>
                        <div id="arr" className={ this.state.arrStyle }>
                            <ul id="menu" className={ this.state.dropDownStyle }>
                                <li className={ this.state.settingsIconStyle }>
                                    { this.state.settings }
                                </li>
                                <li className={ this.state.logoutIconStyle }>
                                    { this.state.logout }
                                </li>
                            </ul>
                        </div>
                    </span> 
                </div>
            </div>
        )
    }
}

export default Header;