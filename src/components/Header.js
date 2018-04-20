import React, { Component } from 'react';
import ProfileImage from './ProfileImage';

class Header extends Component {
    constructor(props){
        super(props);
        this.state={
            userId: this.props.userId,
            dname: this.props.dname,
            home: this.props.home,
            friends: this.props.friends,
            settings: this.props.settings,
            logout: this.props.logout,
            dropDownStyle: null,
            arrStyle: null,
            homeStyle: "menu icon icon-youtube-alt",
            friendsStyle: "menu icon icon-torsos-all",
            chatStyle: "menu icon icon-comments",
            menuStyle: "menu icon icon-menu",
            settingsIconStyle: "small icon-settings",
            logoutIconStyle: "small icon-logout"
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
                    <span className={ this.state.friendsStyle } onClick={ this.state.friends }></span>
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