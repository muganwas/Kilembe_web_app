import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dispatchedGenInfo } from '../../redux/dispatchers';
import { ChatManager, TokenProvider } from '@pusher/chatkit';
import Footer from '../Footer';
import Rebase from 're-base';
import app from '../../base';
import './css/main.css';
import axios from 'axios';

//components
import MessagingNav from './MessagingNav';

const usersRef = app.database().ref('users');
const base = Rebase.createClass(app.database());
var chatManager;

@connect((store)=>{
    return{
        chatkitUser: store.genInfo.info.chatkitUser,
        genInfo: store.genInfo,
        allUsers: store.genInfo.info.allUsers
    }  
})
class Messaging extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }

    componentWillMount(){
        let uid = this.props.userId;
        this.fetchAllUsers();
        this.fetchFriends(uid).then((rez)=>{
            this.getAvatar();
        })
        base.fetch(`users/${ uid }/chatkit_uid`, {
            context: this,
            asArray: false
        }).then((data)=>{
            let len = Object.keys(data).length;
            if(len === 0){
                let url = process.env.CHATKIT_CREATE_USER + this.props.userId + "&name="+ this.props.dname;
                axios(url)
                .then((res)=>{
                    chatkit_id = res.data.id;
                    usersRef.child(this.props.userId).update({
                        chatkit_uid: chatkit_id
                    });
                })
                .catch((err)=>{
                    console.log(err)
                });
            }else{
                let url = process.env.CHATKIT_TOKEN_PROVIDER + data;
                chatManager = new ChatManager({
                    instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
                    userId: data,
                    tokenProvider: new TokenProvider({ url })
                });
                chatManager.connect()
                .then(currentUser => {
                    console.log('Successful connection', currentUser)
                })
                .catch(err => {
                    console.log('Error on connection', err)
                });
            }
        });
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }

    confirmToken = (token)=>{
        let url = process.env.CONFIRM_FIREBASE_TOKEN + token;
        axios(url)
        .then(response=>{
            console.log(response);
        })
        .catch(err=>{
            console.log(err.message)
        })
    }

    fetchFriends = (uid)=>{
        return new Promise((resolve, reject)=>{
            base.fetch(`users/${ uid }/friends`, {
                context: this,
                asArray: true
            }).then((data)=>{
                let info = {...this.props.genInfo.info};
                info.friends = data;
                this.props.dispatch(dispatchedGenInfo(info));
                resolve("done");
            }).catch(err=>{
                console.log(err)
                reject("there was an error");
            })
        })        
    }

    fetchAllUsers = ()=>{
        base.fetch(`users`, {
            context: this,
            asArray: false
        }).then((dataB)=>{
            let info = { ...this.props.genInfo.info }
            info.allUsers = dataB;
            this.props.dispatch(dispatchedGenInfo(info));
        });
    }

    getAvatar = ()=>{
        base.fetch(`users`, {
            context: this,
            asArray: true
        }).then((dataB)=>{
            dataB.forEach((elB)=>{
                let uid = elB.key;
                let avatar = elB.avatar;
                let info = { ...this.props.genInfo.info }
                let currUsers = [...info.friends];
                currUsers.forEach((el)=>{
                    //checking whether key and uid are the same
                    if(el.key === uid){
                        el.avatar = avatar;
                        info.friends = currUsers;
                        this.props.dispatch(dispatchedGenInfo(info));
                    }                
                });
            });
        }).catch(err=>{
            console.log(err)
        })
    }

    displayFriends = (key)=>{
        let friends = this.props.genInfo.info.friends;
        let uid = friends[key].key;
        let avatar = friends[key].avatar;
        let allUsers= this.props.allUsers;
        return (
            <div key={key} className="friend">
                <div className="left">
                    <div className="roundPic membersAv">
                        <img alt={ uid } className="members" src = { avatar } />
                    </div>
                    <div className="name">{ allUsers?allUsers[uid].dname:null }</div>
                    <div className="clear"></div>
                </div>
            </div>
        )
    }

    render(){
        let friends = { ...this.props.genInfo.info.friends };
        return(
            <div className="Home">
                <div className="container">
                    { this.props.header }
                    <div className="messaging">
                        <div className="friends">
                            <h3>Friends</h3>
                            { friends?Object.keys(friends).map(this.displayFriends):null }
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }

}

export default Messaging;
