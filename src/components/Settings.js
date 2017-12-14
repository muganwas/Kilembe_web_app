import React, { Component } from 'react';
import Rebase from 're-base';
import app from '../base';
let base = Rebase.createClass(app.database());

class Settings extends Component {
    constructor(props){
        super(props)
        this.disabled = this.disabled.bind(this);
        this.changeDname = this.changeDname.bind(this);
        this.changeUid = this.changeUid.bind(this);
        this.save = this.save.bind(this);
        this.state = {
            disabled: true            
        }
    }
    componentWillMount(){
        const userID = localStorage.getItem('uid');     
        base.fetch(`users/${ userID }`, {
            context: this,
            asArray: true
        }).then((data)=>{
            let length = data.length;
            if(length!=0 && length!==null) {
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
            }
        });
    }
    disabled() {
        this.setState({
            disabled: !this.state.disabled
        });
    }
    changeDname(kant) {
        this.setState({
            dname: kant.target.value
        });
    }
    changeUid(kant) {
        this.setState({
            uid: kant.target.value
        });
    }
    save() {
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
                        <span onClick={ this.disabled } className="icon icon-pencil">Settings </span>
                        <span className="settingT">Your Email Address: </span> <span className="settingD"><input type="text" defaultValue={()=>this.state.email } placeholder={ this.state.email } disabled="true" /></span>
                        <span className="settingT">Your Display Name: </span> <span className="settingD"><input className="icon" type="text" defaultValue={ this.state.dname } placeholder={ this.state.dname } onChange={ this.changeDname } disabled={ this.state.disabled }/></span>
                        <span className="settingT">Your User Id: </span> <span className="settingD"><input className="icon" type="text" defaultValue={ this.state.uid } placeholder={ this.state.uid } onChange={ this.changeUid } disabled={ this.state.disabled }/></span>
                        <span onClick={ this.save }  className="icon icon-floppy"></span>
                    </div>
                </div>
            </div>
        )
    }

}

export default Settings;
