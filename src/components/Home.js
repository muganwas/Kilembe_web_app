import React, { Component } from 'react';
import Rebase from 're-base';
import app from '../base';
let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

class Home extends Component {
    constructor(){
        super();
        this.state = {

        }
    }
    componentWillMount(){
        const userID = this.props.uid;     
        base.fetch(`users/${ userID }`, {
            context: this,
            asArray: true
        }).then((data)=>{
            let length = data.length;
            if(length!=0 && length!=null) {
                base.syncState(`users/${ userID }/dname`, {
                    context: this,
                    state: 'dname'
                });
                base.syncState(`users/${ userID }/uid`, {
                    context: this,
                    state: 'uid'
                });
                base.syncState(`users/${ userID }/email`, {
                    context: this,
                    state: 'email'
                });
            }else{
                console.log('not here!')
            }
        });
    }
    render(){  
        const userID = this.props.uid;     
        base.fetch(`users/${ userID }`, {
            context: this,
            asArray: true
        }).then((data)=>{
            let length = data.length;
            if(length===0 || length===null) {
                let userRef = usersRef.child(userID);
                userRef.set({
                    email: localStorage.getItem('email'),
                    dname: localStorage.getItem('dname'),
                    uid: localStorage.getItem('uid')
                });
            }
        });
        return (
            <div className="container">
                {this.props.header}
                <div className="content">
                    <span id="welcome">You are Home, {this.state.dname}!</span>
                </div>
                
            </div>
        )
    }
}

export default Home;