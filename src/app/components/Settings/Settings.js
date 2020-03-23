import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, CheckBox } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Rebase from 're-base';
import app from 'misc/base';
import { 
    Header,
    Footer,
    KLoader
} from 'components';
import {
    fetchUserInfoFromDB
} from 'reduxFiles/dispatchers/userDispatchers';
import { 
    isMobile, 
    isSmallMobile,
    isTab
} from 'misc/helpers';
import styles from './styling/styles';
import mainStyles from 'styles/mainStyles';
import ToggleOff from '@material-ui/icons/ToggleOff';
import ToggleOn from '@material-ui/icons/ToggleOn';

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
        infoFetched: false,
        isMobile: isMobile(),
        isSmallMobile: isSmallMobile(),
        tab: isTab()
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
        window.onresize = () => {
            const width = window.innerWidth;
            this.setState({
                isMobile: isMobile(width),
                isSmallMobile: isSmallMobile(width),
                tab: isTab(width)
            });
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

    toggleEditing = () => {
        const { disabled } = this.state;
        if (!disabled) this.save();
        this.setState({
            disabled: !disabled
        });
    }

    changeShareStatus = () => {
        this.setState({
            shareEmailAddress: !this.state.shareEmailAddress
        })
    }  
    changeEntry = (key, value) => {
        this.setState({
            [key]: value
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
    }

    render(){
        const { email, dname, uid, about, shareEmailAddress, disabled, isMobile, tab } = this.state;
        const { dbUserInfo: { fetched } } = this.props;
        const mainContainerStyle = isMobile ? 
        mainStyles.mainContainerMobi : 
        tab ? 
        mainStyles.mainContainerTab : 
        mainStyles.mainContainer;
        return(
            <View style={mainContainerStyle}>
                <Header />
                <View style={isMobile ? mainStyles.contentMobi : mainStyles.content}>
                    <Text style={mainStyles.title}><FormattedMessage id="settings.pageTitle"/></Text>
                        { fetched ?
                            <View>
                                <TouchableOpacity onPress={this.toggleEditing} style={styles.iconContainer}>
                                    { disabled ? <ToggleOff style={styles.toggleOff} /> : <ToggleOn style={styles.toggleOn} /> }
                                    <Text style={styles.Subtitle}><FormattedMessage id={ disabled ? "settings.editProfile" : "settings.saveProfile"}/></Text>
                                </TouchableOpacity>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}><FormattedMessage id="settings.emailLabel"/>: </Text> 
                                    <TextInput 
                                        id="email" 
                                        style={styles.input}
                                        value={ email } 
                                        disabled={true}
                                    />
                                </View>
                            
                                <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}><FormattedMessage id="settings.dnameLabel"/>: </Text> 
                                    <TextInput 
                                        id="dname" 
                                        style={styles.input}
                                        value={ dname } 
                                        onChangeText={ text => {
                                            this.changeEntry('dname', text);
                                        } } 
                                        disabled={ disabled }
                                    />
                                </View>
                                
                                <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}><FormattedMessage id="settings.userIdLabel"/>: </Text> 
                                    <TextInput 
                                        id="uid" 
                                        style={styles.input}
                                        value={ uid } 
                                        disabled={ true }
                                    />
                                </View>
                                
                                <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}><FormattedMessage id="settings.aboutLabel" />: </Text> 
                                    <TextInput 
                                        id="about"  
                                        multiline
                                        numberOfLines={4}
                                        style={styles.input}
                                        value={ about } 
                                        onChangeText={ text => {
                                            this.changeEntry('about', text);
                                        } }
                                        disabled={ disabled }
                                    />
                                </View>
                                
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}><FormattedMessage id="settings.shareEmailLabel"/>: </Text>
                                    <View style={styles.checkBoxContainer}>
                                        <CheckBox 
                                            id="shareEmailAddress" 
                                            style={styles.shareCheckBox}
                                            onChange={this.changeShareStatus} 
                                            disabled={ disabled } 
                                            value={ shareEmailAddress }
                                        /> 
                                        <Text style={styles.shareEmailDescription}><FormattedMessage id="settings.shareEmailDescription" /></Text>
                                    </View>
                                </View>
                            </View> :
                            <KLoader 
                                type="TailSpin"
                                color="#757575"
                                height={50}
                                width={50}
                            />
                        }
                </View>
                <Footer />
            </View>
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
