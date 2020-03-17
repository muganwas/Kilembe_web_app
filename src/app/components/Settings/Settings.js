import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Rebase from 're-base';
import app from 'misc/base';
import { 
    Header,
    Footer
} from 'components';
import {
    fetchUserInfoFromDB
} from 'reduxFiles/dispatchers/userDispatchers';

const base = Rebase.createClass(app.database());

class Settings extends Component {
    state = {
        disabled: true,
        shareEmailAddress: false,
        email: '',
        dname: '',
        uid: '',
        chatkit_uid: '',
        about: '',
        shareEmailAddress: false,
        infoFetched: false
    }

    componentDidMount(){ 
        const { genInfo: { info: { uid } },loginInfo: { loggedIn }, dbUserInfo, fetchCurrentUserInfoFromDB } = this.props;
        if (loggedIn){
            // console.log(friendsFetched + ' ' + fetched)
            const dbUserInfoFetched = dbUserInfo.fetched;
            const userInfo = dbUserInfo.userInfo
            if(!dbUserInfoFetched && uid) fetchCurrentUserInfoFromDB(uid);
            if (dbUserInfoFetched && !this.state.infoFetched) {
                Object.keys(userInfo).map(key => {
                    this.setState({
                        [key]: userInfo[key]
                    })
                });
                this.setState({infoFetched: true});
            }
        }
    }

    componentDidUpdate(){
        const { genInfo: { info: { uid } }, loginInfo: { loggedIn }, dbUserInfo, fetchCurrentUserInfoFromDB } = this.props;
        const storedInfo = JSON.parse(localStorage.getItem('genInfo'));
        const storedUid = storedInfo.uid;
        if (loggedIn) {
            // console.log(friendsFetched + ' ' + fetched)
            const finalUid = uid ? uid : storedUid;
            const dbUserInfoFetched = dbUserInfo.fetched;
            const userInfo = dbUserInfo.userInfo;
            if(!dbUserInfoFetched && finalUid) fetchCurrentUserInfoFromDB(finalUid);
            if (dbUserInfoFetched && !this.state.infoFetched) {
                Object.keys(userInfo).map(key => {
                    this.setState({
                        [key]: userInfo[key]
                    });
                });
                this.setState({infoFetched: true});
            }
        }
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
        const { dname, uid, about, shareEmailAddress } = this.state;
        const usersRef = app.database().ref('users');
        base.fetch(`users/${uid}`, {
            context: this,
            asArray: true
        }).then(data => {
            let length = data.length;
            if(length!==0 && length!==null) {
                usersRef.child(`${uid}`).update({
                    dname,
                    about,
                    shareEmailAddress
                });
            }
        });
        this.setState({
            disabled:true
        });   
    }

    render(){
        const { email, dname, uid, about, shareEmailAddress, disabled } = this.state;
        return(
            <div className="container Home">
                <Header />
                <div className="content">
                    <h4><FormattedMessage id="settings.pageTitle"/></h4>
                    <span onClick={ this.disabled } className="icon icon-pencil"><FormattedMessage id="settings.profileTitle"/></span>
                    <span className="settingT"><FormattedMessage id="settings.emailLabel"/>: </span> 
                    <span className="settingD">
                        <input 
                            id="email" 
                            type="text" 
                            value={ email } 
                            disabled={true}
                        />
                    </span>
                    <span className="settingT"><FormattedMessage id="settings.dnameLabel"/>: </span> 
                    <span className="settingD">
                        <input 
                            id="dname" 
                            className="icon" 
                            type="text" 
                            value={ dname } 
                            onChange={ this.changeEntry } 
                            disabled={ disabled }
                        />
                    </span>
                    <span className="settingT"><FormattedMessage id="settings.userIdLabel"/>: </span> 
                    <span className="settingD">
                        <input 
                            id="uid" 
                            className="icon" 
                            type="text" 
                            value={ uid } 
                            disabled={ true }
                        />
                    </span>
                    <span className="settingT"><FormattedMessage id="settings.aboutLabel" />: </span> 
                    <span className="settingD">
                        <textarea 
                            id="about"  
                            className="icon" 
                            value={ about } 
                            onChange={ this.changeEntry } 
                            disabled={ disabled }
                        />
                    </span>
                    <span className="settingT"><FormattedMessage id="settings.shareEmailLabel"/>: </span> 
                    <span className="settingD">
                        <input 
                            id="shareEmailAddress" 
                            className="icon" 
                            type="checkbox" 
                            onChange={ this.changeShareStatus } 
                            disabled={ disabled } 
                            checked={ shareEmailAddress }
                        /> 
                    <span className="info"><FormattedMessage id="settings.shareEmailDescription" /></span></span>
                    <button onClick={ this.save }  className="icon icon-floppy" disabled={ disabled }/>
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
    dbUserInfo: PropTypes.object,
    fetchCurrentUserInfoFromDB: PropTypes.func
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        loginInfo: state.loginInfo,
        friendsInfo: state.friendsInfo,
        dbUserInfo: state.userInfo
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchCurrentUserInfoFromDB: uid => {
            dispatch(fetchUserInfoFromDB(uid));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
