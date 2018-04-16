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
            header: this.props.header,
            userId: this.props.userId,
            users: {}
        }
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
    getUsers = (key) => {
        let users = this.state.users;
        let uCount = users.length;
        let userImg = users[key].avatar;
        if(uCount !== 0){
            return(
                <div key={key}>
                    <div className="roundPic membersAv"><img alt={ key } className="members" src={ userImg } /></div><div className="pfriends">{ users[key].dname }</div>
                </div>
            )
        }
    }
    render(){
        var users = this.state.users;
        return (
            <div className="Home">
                <div className="container">
                    { this.state.header }
                    <div className="content">
                        <div className="sub-container">
                            { Object.keys(users).map(this.getUsers) }
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}

export default Friends;