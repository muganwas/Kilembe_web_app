import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import app from '../../base';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import { isMobile, shortName } from 'misc/helpers';
import { REMOVE_FEEDBACK_DELAY } from 'misc/constants';
import styles from './styling/styles';

var storage = firebase.storage();
var storageRef = storage.ref();

class ProfileImage extends Component {

    state = {
        imessage: undefined,
        uploading: false
    }
    
    componentDidMount(){
        let { genInfo } = this.props;
        let { info: { avURL } } = genInfo;
        //console.log(dname)
        if (!avURL) {
            let storedInfo = localStorage.getItem('genInfo');
            storedInfo = storedInfo ? 
            JSON.parse(storedInfo) : 
            null;
        } 
    }

    updateAvatar = url => {
        const { userId, genInfo, updateGenInfo } = this.props;
        const { info: { avURL } } = genInfo;
        let newInfo = Object.assign({}, genInfo.info);
        newInfo.avURL = url;
        const usersRef = app.database().ref('users');
        usersRef.child(`${userId}`).update({
            avatar: url
        });
        if (String(avURL) !== String(url)) {
            console.log(newInfo);
            updateGenInfo(newInfo);
            localStorage.setItem('genInfo', JSON.stringify(newInfo));
        }
    }
    
    uploadAv = e => {
        let userId = this.state.userId;
        let file = e.target.files[0];
        let fname = file.name;
        let fnameArr = fname.split('.');
        let fnameExt = fnameArr.pop();
        this.setState({uploading: true});
        if (fnameExt === "jpg" || fnameExt === "png" || fnameExt === "jpeg" || fnameExt === "gif") {
            let newAvRef = storageRef.child(`${ userId }/avatar.${ fnameExt }`);
            newAvRef.put(file).then(() => {
                storageRef.child(`${ userId }/avatar.${fnameExt}`).getDownloadURL().then(url => {
                    this.setState({
                        imessage: "Upload Complete"
                    });
                    this.updateAvatar(url);
                    setTimeout(() => {
                        this.setState({imessage: undefined});
                    }, REMOVE_FEEDBACK_DELAY);
                }); 
            }, () => {
                this.setState({
                    imessage: 'There was an error!, try again.',
                });
                setTimeout(() => {
                    this.setState({imessage: undefined});
                }, REMOVE_FEEDBACK_DELAY);
            });
        }
        else {
            this.setState({
                imessage: `The file extention ${ fnameExt } is not allowed!`,
            });
            setTimeout(() => {
                this.setState({imessage: undefined});
            }, REMOVE_FEEDBACK_DELAY);
        }
    }

    clickUploadAv = () => {
        let uploadB = document.getElementById('hs');
        uploadB.click();
    }
    
    render(){
        const { imessage } = this.state;
        const { avURL, genInfo: { info: { displayName } } } = this.props;

        return (
            <View style={styles.profile}>
                { imessage ? <Text style={styles.uploadFeedback}>{ imessage }</Text> : null }
                <View style={ styles.avatarUploaderContainer }>
                    <form method="POST" encType="multipart/form-data">
                        <input className="hidden" type="file" id="hs" name="avator" onChange={ this.uploadAv } ></input>
                        <View style={ styles.avatarContainer } onClick={this.clickUploadAv}>
                            { avURL ? 
                            <Image
                                style={styles.avatar} 
                                alt="Your Avatar" 
                                title="click to change Avatar" 
                                source = { avURL } 
                            /> : 
                            null }
                        </View>
                    </form>
                </View> 
                <Text style={styles.welcome}>{ isMobile() ? shortName(displayName) : displayName }</Text>
            </View>
        )
    }
}

ProfileImage.propTypes = {
    avURL: PropTypes.string,
    genInfo: PropTypes.object,
    updateGenInfo: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        avURL: state.genInfo.info.avURL,
        genInfo: state.genInfo
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateGenInfo: genInfo => {
            dispatch(dispatchedGenInfo(genInfo));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileImage);