import React, { Component } from 'react';
import ProfileImage from './ProfileImage';
//import Rebase from 're-base';
import app from '../base';
//let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

class Header extends Component {
    constructor(props){
        super(props);
        this.state={
            userId: this.props.userId,
            dname: this.props.dname,
            home: this.props.home,
            appUsers: this.props.appUsers,
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
                    <span className={ this.state.chatStyle }></span> 
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