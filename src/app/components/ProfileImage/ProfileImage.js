import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import Rebase from 're-base';
import app from '../../base';
import { getUserAvatar } from 'misc/functions';

let base = Rebase.createClass(app.database());
var storage = firebase.storage();
var storageRef = storage.ref();

class ProfileImage extends Component {
    constructor(){
        super(); 
        this.state={
            levelId: "",
            imessage: null,
            picState: "roundPic hidden"
        }
    }

    componentDidMount(){
        let { genInfo } = this.props;
        let { info: { avURL, displayName, uid } } = genInfo;
        //console.log(dname)
        if(!avURL){
            let storedInfo = sessionStorage.getItem('genInfo');
            storedInfo = storedInfo?JSON.parse(storedInfo):null;
            if( storedInfo ){
                let { avURL, displayName  } = storedInfo;
                this.setState({ avatar:avURL, picState: "roundPic", dname: displayName });
            }else
                this.getImage();
        }else{
            this.setState({ 
                avatar:avURL, 
                dname: displayName,
                picState: "roundPic",
                userId:uid
            });
        }
    }
    
    synState = ()=>{
        let userId = this.props.userId;
        if(this.state.avatar !== undefined && this.state.avatar !== null){
            base.syncState(`users/${ userId }/avatar`, {
                context: this,
                state: 'avatar'
            });
        }
    }

    getImage = ()=>{
        let { genInfo } = this.props;
        let { info: { uid } } = genInfo;
        getUserAvatar(uid).
        then(url=>{
            this.setState({
            avatar: url,
            picState: "roundPic",
            imessage: "",
            levelId: "level hidden"
            });
        });
    }
    
    uploadAv = (e)=>{
        let userId = this.state.userId;
        let file = e.target.files[0];
        let fname = file.name;
        let fnameArr = fname.split('.');
        let fnameExt = fnameArr.pop();
        if(fnameExt === "jpg" || fnameExt === "png" || fnameExt === "jpeg" || fnameExt === "gif"){
            let newAvRef = storageRef.child(`${ userId }/avatar.${ fnameExt }`);
            newAvRef.put(file).then(()=>{
                storageRef.child(`${ userId }/avatar.${fnameExt}`).getDownloadURL().then((url)=>{
                    this.setState({
                        avatar: url,
                        picState: "roundPic",
                        imessage: "Upload Complete",
                        levelId: "level",
                        ext: fnameExt,
                        uploaded: true
                    });
                    setTimeout(()=>{
                        this.getImage();
                    }, 3000);
                });
            }, ()=>{
                this.setState({
                    imessage: 'There was an error!, try again.',
                    levelId: "level"
                });
            });
        }else{
            this.setState({
                imessage: `The file extention ${ fnameExt } is not allowed!`,
                levelId: "level"
            });
        }
    }

    clickUploadAv = ()=>{
        let uploadB = document.getElementById('hs');
        uploadB.click();
    }
    
    render(){
        let { avatar, picState, imessage, levelId, dname } = this.state;
        //console.log(dname)
        return (
            <div className="avContainer">
                { imessage?<span id={ levelId }>{ imessage }</span>:null }
                <div className="avator">
                    <form method="POST" encType="multipart/form-data">
                        <input className="hidden" type="file" id="hs" name="avator" onChange={ this.uploadAv } ></input>
                        <div className={ picState }>
                            { avatar?<img id="avator" alt="Your Avatar" title="click to change Avatar" src = { avatar } onClick={ this.clickUploadAv }/>: null }
                        </div>
                    </form>
                </div>
                <span id="welcome">{ dname }</span>
            </div>
        )
    }
}

ProfileImage.propTypes = {
    avURL: PropTypes.string,
    genInfo: PropTypes.object
}

const mapStateToProps = state => {
    return {
        avURL: state.loginInfo.avURL,
        genInfo: state.genInfo
    }
}

export default connect(mapStateToProps)(ProfileImage);