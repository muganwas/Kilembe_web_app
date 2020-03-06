import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Rebase from 're-base';
import app from '../../base';
import { 
    Header,
    Footer
} from 'components';
let base = Rebase.createClass(app.database());

class Settings extends Component {
    state = {
        disabled: true,
        shareEmailAddress: false
    }
    componentDidMount(){ 
        const { uid } = JSON.parse(localStorage.getItem('genInfo'));
        base.fetch(`users/${uid}`, {
            context: this,
            asArray: true
        }).then((data)=>{
            let length = data.length;
            if(length!==0 && length!==null) {
                base.syncState(`users/${uid}/dname`, {
                    context: this,
                    state: 'dname'
                });
                base.syncState(`users/${uid}/uid`, {
                    context: this,
                    state: 'uid'
                });
                base.syncState(`users/${uid}/email`, {
                    context: this,
                    state: 'email'
                });
                base.syncState(`users/${uid}/about`, {
                    context: this,
                    state: 'about'
                });
                base.syncState(`users/${uid}/shareEmailAddress`, {
                    context: this,
                    state: 'shareEmailAddress'
                });
                base.syncState(`users/${uid}/chatkit_uid`, {
                    context: this,
                    state: 'chatkit_uid'
                });
            }
        });
    }

    disabled = () => {
        this.setState({
            disabled: !this.state.disabled
        });
    }

    changeShareStatus = e => {
        e.preventDefault();
        this.setState({
            shareEmailAddress: !this.state.shareEmailAddress
        })
    }  
    changeEntry = e => {
        let dname = e.target.value;
        let dnameObj = {};
        dnameObj[e.target.id] = dname;
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    save = () => {
        localStorage.setItem('dname', this.state.dname);
        localStorage.setItem('uid', this.state.uid);
        this.setState({
            disabled:true
        });   
    }

    render(){
        return(
            <div className="container Home">
                <Header />
                <div className="content">
                    <h4>Settings</h4>
                    <span onClick={ this.disabled } className="icon icon-pencil">Profile</span>
                    <span className="settingT">Your Email Address: </span> 
                    <span className="settingD">
                        <input 
                            id="email" 
                            type="text" 
                            value={ this.state.email } 
                            disabled="true" 
                        />
                    </span>
                    <span className="settingT">Your Display Name: </span> 
                    <span className="settingD">
                        <input 
                            id="dname" 
                            className="icon" 
                            type="text" 
                            value={ this.state.dname } 
                            onChange={ this.changeEntry } 
                            disabled={ this.state.disabled }
                        />
                    </span>
                    <span className="settingT">Your User Id: </span> 
                    <span className="settingD">
                        <input 
                            id="uid" 
                            className="icon" 
                            type="text" 
                            value={ this.state.uid } 
                            onChange={ this.changeEntry } 
                            disabled={ this.state.disabled }
                        />
                    </span>
                    <span className="settingT">Chatkit Uid: </span> 
                    <span className="settingD">
                        <input 
                            id="chatkit_uid" 
                            className="icon" 
                            type="text" 
                            value={ this.state.chatkit_uid } 
                            onChange={ this.changeEntry } 
                            disabled={ this.state.disabled }
                        />
                    </span>
                    <span className="settingT">About Me: </span> 
                    <span className="settingD">
                        <textarea 
                            id="about"  
                            className="icon" 
                            value={ this.state.about } 
                            onChange={ this.changeEntry } 
                            disabled={ this.state.disabled }
                        />
                    </span>
                    <span className="settingT">Share Email Address: </span> 
                    <span className="settingD">
                        <input 
                            id="shareEmailAddress" 
                            className="icon" 
                            type="checkbox" 
                            onChange={ this.changeShareStatus } 
                            disabled={ this.state.disabled } 
                            checked={ this.state.shareEmailAddress }
                        /> 
                    <span className="info">check to share email address with other users</span></span>
                    <button onClick={ this.save }  className="icon icon-floppy" disabled={ this.state.disabled }/>
                </div>
                <Footer />
            </div>
        )
    }

}

Settings.propTypes = {
    genInfo: PropTypes.object,
    loginInfo: PropTypes.object,
    friendsInfo: PropTypes.object,
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        loginInfo: state.loginInfo,
        friendsInfo: state.friendsInfo
    }
}

export default connect(mapStateToProps)(Settings);
