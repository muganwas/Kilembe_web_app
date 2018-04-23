import React, { Component } from 'react';
import Footer from './Footer';
import Rebase from 're-base';
import app from '../base';
import UserDetails from './UserDetails';
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
            specific: false,
            friends: {}
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
        let newUsers = {...this.state.users}
        this.setState({
            general: false,
            specific: true,
            currUserId: newUsers[key].uid,
            currUserDname: newUsers[key].dname,
            currUserAvUrl: newUsers[key].avatar,
            currUserEmail: newUsers[key].shareEmailAddress === true?newUsers[key].email:"Email Address is hidden",
            currUserAbout: newUsers[key].about,
            currUserSharePref: newUsers[key].shareEmailAddress
        });
    }
    getUsers = (key) => {
        let loggedInUser = this.state.userId;
        let users = {...this.state.users};
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
               <UserDetails 
                 friends = { this.state.friends } 
                 header = { this.props.header }
                 addFriendState = { this.state.addFriendState }
                 currUserSharePref = { this.state.currUserSharePref } 
                 currUserAbout = { this.state.currUserAbout } 
                 currUserEmail = { this.state.currUserEmail } 
                 currUserDname = { this.state.currUserDname } 
                 currUserAvUrl = { this.state.currUserAvUrl } 
                 currUserId={ this.state.currUserId } 
                 userId={ this.state.userId } 
                 backToUsers = { this.backToUsers } 
                 userDetail = { this.userDetail } />
            )
        } 
    }
}

export default Friends;