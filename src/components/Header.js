import React, { Component } from 'react';
import ProfileImage from './ProfileImage';

class Header extends Component {
    constructor(props){
        super(props);
        this.state={
            userId: this.props.userId,
            dname: this.props.dname
        }
    }
    showMenu = ()=>{
        var menu = document.getElementById('menu');
        var arr = document.getElementById('arr');
        if(menu.classList.contains("visible")){
            menu.classList.remove("visible");
            arr.classList.remove("visible");
        }else{
            menu.classList.add("visible");
            arr.classList.add("visible");
        }
    }
    render(){
        return (
            <div className="mainNav">
                <ProfileImage dname={ this.state.dname } userId = { this.state.userId } />     
                <div className="nav">    
                    <span className="menu icon icon-home" onClick={this.props.home }></span>   
                    <span className="menu icon icon-menu" onClick={this.showMenu}>
                        <div id="arr">
                            <ul id="menu">
                                <li className="small icon-settings">
                                    {this.props.settings}
                                </li>
                                <li className="small icon-logout">
                                    {this.props.logout}
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