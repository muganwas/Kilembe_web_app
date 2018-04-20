import React, { Component } from 'react';
import Footer from './Footer';
import Rebase from 're-base';
import app from '../base';
let base = Rebase.createClass(app.database());
//let usersRef = app.database().ref('users');

class Friends extends Component {
    constructor(props){
        super(props);
        this.state={
            userId: this.props.userId,
            users: {},
            peopleListStyle: "people",
            general: true,
            specific: false
        }
    }
    componentWillMount(){
        base.fetch(`users`, {
            context: this,
            asArray: true
        }).then((data)=>{
            let length = data.length;
            if(length!==0 && length!==null) {
                this.setState({
                    users: data
                });
            }
        });
    }
    backToUsers = ()=>{
        this.setState({
            general: true,
            specific: false,
            currUserId: null,
            currUserDname: null,
            currUserAvUrl: null,
            currUserAbout: null,
            currUserSharePref: null
        });
    }
    userDetail = (key)=>{
        this.setState({
            general: false,
            specific: true,
            currUserId: (this.state.users)[key].uid,
            currUserDname: (this.state.users)[key].dname,
            currUserAvUrl: (this.state.users)[key].avatar,
            currUserEmail: (this.state.users)[key].shareEmailAddress === true?(this.state.users)[key].email:"Email Address is hidden",
            currUserAbout: (this.state.users)[key].about,
            currUserSharePref: (this.state.users)[key].shareEmailAddress
        });
    }
    getUsers = (key) => {
        let loggedInUser = this.state.userId;
        let users = this.state.users;
        let uCount = users.length;
        let userImg = users[key].avatar;
        let dname = users[key].dname;
        let userId = users[key].uid;
        if(uCount !== 0 && loggedInUser !== userId){
            return(
                <div title={ dname } id={ userId } key={key} className={ this.state.peopleListStyle } onClick={ ()=>{ this.userDetail(key)} }>
                    <div className="roundPic membersAv"><img alt={ key } className="members" src={ userImg } /></div><div className="pfriends">{ users[key].dname }</div>
                </div>
            )
        }
    }
    render(){
        if(this.state.general === true){
            return (
                <div className="Home">
                    <div className="container">
                        { this.props.header }
                        <div className="content">
                            <h4>Kilembe Users</h4>
                            <div className="sub-container">
                                { Object.keys(this.state.users).map(this.getUsers) }
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            )
        }else{
            return(
                <div className="Home">
                    <div className="container">
                        { this.props.header }
                        <div className="content">
                            <div className="ficon icon-left-open-mini nav-button-container" onClick={ ()=>{this.backToUsers()} }>
                                <span className="nav-button">Back</span>
                            </div>
                            <div className="currUserDits">
                                <div id="left">
                                    <div className="roundPic membersAv"><img alt={ this.state.currUserDname } className="members" src={ this.state.currUserAvUrl } /></div>
                                </div>
                                <div id="center">
                                    <div id="displayName">
                                        <div className="ficon nav-button-container icon-megaphone"><span>{ this.state.currUserDname }</span></div>  
                                    </div>
                                    <div id={ this.state.currUserEmail }>
                                        <div className="ficon nav-button-container icon-mail"><span>{ this.state.currUserEmail }</span></div> 
                                    </div>
                                    <div id="add-user">
                                        <div className="ficon nav-button-container icon-user-add"><span> Add Friend</span></div> 
                                    </div>
                                </div>
                                <div id="right">
                                    <span className="icon-quote"></span>
                                    <div id="about-me">{ this.state.currUserAbout }</div>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            )
        } 
    }
}

export default Friends;