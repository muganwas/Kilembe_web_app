import React, { Component } from 'react';
import firebase from 'firebase';
import Rebase from 're-base';
import app from '../base';
let base = Rebase.createClass(app.database());
var storage = firebase.storage();
var storageRef = storage.ref();

class ProfileImage extends Component {
    constructor(props){
        super(props); 
        this.state={
            userId: this.props.userId,
            dname: this.props.dname,
            levelId: "",
            picState: "roundPic hidden"
        }
    }
    
    componentWillMount(){ 
        this.getImage();
        /*let propAv = this.props.avatar;
        let avatar = localStorage.getItem("avatar");
        if(propAv !== null && propAv !== undefined){
            this.setState({
                avatar: propAv,
                picState: "roundPic"
            });
        }else{
            this.setState({
                avatar: avatar,
                picState: "roundPic"
            });
        }*/ 
    }
    /*
    componentDidMount(){
        
        if(this.state.uploaded === true){
            this.synState();
        }
        //this.getImage();
    }
    */
    synState = ()=>{
        let userId = this.props.userId;
        base.syncState(`users/${ userId }/avatar`, {
            context: this,
            state: 'avatar'
        });
    }
    getImage = ()=>{
        let userId = this.props.userId;
        base.fetch(`users/${ userId }`, {
            context: this,
            asArray: true,
            then(data){
                let len = data.length;
                if( len !== 0){
                    let fl = data[0][0];
                    let avURL = data[0];
                    if(fl === "h"){
                        this.setState({
                        avatar: avURL,
                        picState: "roundPic",
                        imessage: "",
                        levelId: "level hidden"
                        });
                        localStorage.setItem('avatar', avURL);
                        this.synState();
                    }else{
                        storageRef.child('general/avatar.jpg').getDownloadURL().then((data)=>{
                        this.setState({
                            avatar: data,
                            picState: "roundPic",
                            imessage: "",
                            levelId: "level hidden"
                        });
                        localStorage.setItem('avatar', data);
                        this.synState();
                        });
                    }
                }else{
                    storageRef.child('general/avatar.jpg').getDownloadURL().then((data)=>{
                        this.setState({
                            avatar: data,
                            picState: "roundPic",
                            imessage: "",
                            levelId: "level hidden"
                        });
                        localStorage.setItem('avatar', data);
                        this.synState();
                    }); 
                }
            }
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
                    //localStorage.setItem('avatar', url);
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
        var image = this.state.avatar;
        return (
            <div className="avContainer">
                <span id={ this.state.levelId }>{ this.state.imessage }</span>
                <div className="avator">
                    <form method="POST" encType="multipart/form-data">
                        <input className="hidden" type="file" id="hs" name="avator" onChange={ this.uploadAv } ></input>
                        <div className={ this.state.picState }>
                            <img id="avator" alt="click to change Avatar" title="click to change Avatar" src = { image } onClick={ this.clickUploadAv }/>
                        </div>
                    </form>
                </div>
                <span id="welcome">{ this.state.dname || this.props.dname }</span>
            </div>
        )
    }
}

export default ProfileImage;