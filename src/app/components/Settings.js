import React, { Component } from 'react';
import Rebase from 're-base';
import app from '../base';
import Footer from './Footer';
let base = Rebase.createClass(app.database());

class Settings extends Component {
    constructor(props){
        super(props)
        this.state = {
            disabled: true,
            shareEmailAddress: false
        }
    }
    componentWillMount(){  
        base.fetch(`users/${ localStorage.getItem('uid') }`, {
            context: this,
            asArray: true
        }).then((data)=>{
            let length = data.length;
            if(length!==0 && length!==null) {
                base.syncState(`users/${ localStorage.getItem('uid') }/dname`, {
                    context: this,
                    state: 'dname'
                });
                base.syncState(`users/${ localStorage.getItem('uid') }/uid`, {
                    context: this,
                    state: 'uid'
                });
                base.syncState(`users/${ localStorage.getItem('uid') }/email`, {
                    context: this,
                    state: 'email'
                });
                base.syncState(`users/${ localStorage.getItem('uid') }/about`, {
                    context: this,
                    state: 'about'
                });
                base.syncState(`users/${ localStorage.getItem('uid') }/shareEmailAddress`, {
                    context: this,
                    state: 'shareEmailAddress'
                });
            }
        });
    }
    disabled = ()=>{
        this.setState({
            disabled: !this.state.disabled
        });
    }
    changeShareStatus = (e)=>{
        this.setState({
            shareEmailAddress: !this.state.shareEmailAddress
        })
    }  
    changeEntry = (kant)=>{
        let dname = kant.target.value;
        let dnameObj = {};
        dnameObj[kant.target.id] = dname;
        this.setState({
            [kant.target.id]: kant.target.value
        });
    }
    save = ()=>{
        localStorage.setItem('dname', this.state.dname);
        localStorage.setItem('uid', this.state.uid);
        this.setState({
            disabled:true
        });   
    }
    render(){
        return(
            <div className="Home">
                <div className="container">
                    { this.props.header }
                    <div className="settings content">
                        <h4>Settings</h4>
                        <span onClick={ this.disabled } className="icon icon-pencil">Profile</span>
                        <span className="settingT">Your Email Address: </span> <span className="settingD"><input id="email" type="text" value={ this.state.email } disabled="true" /></span>
                        <span className="settingT">Your Display Name: </span> <span className="settingD"><input id="dname" className="icon" type="text" value={ this.state.dname } onChange={ this.changeEntry } disabled={ this.state.disabled }/></span>
                        <span className="settingT">Your User Id: </span> <span className="settingD"><input id="uid" className="icon" type="text" value={ this.state.uid } onChange={ this.changeEntry } disabled={ this.state.disabled }/></span>
                        <span className="settingT">About Me: </span> <span className="settingD"><textarea id="about"  className="icon" value={ this.state.about } onChange={ this.changeEntry } disabled={ this.state.disabled }/></span>
                        <span className="settingT">Share Email Address: </span> <span className="settingD"><input id="shareEmailAddress" className="icon" type="checkbox" onChange={ this.changeShareStatus } disabled={ this.state.disabled } checked={ this.state.shareEmailAddress }/> <span className="info">check to share email address with other users</span></span>
                        <button onClick={ this.save }  className="icon icon-floppy" disabled={ this.state.disabled }></button>
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }

}

export default Settings;
