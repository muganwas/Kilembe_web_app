import React, { Component } from 'react';
import firebase from 'firebase';
var storage = firebase.storage();
var storageRef = storage.ref();

class ProfileImage extends Component {
    constructor(props){
        super(props);
        this.state={
            userId: this.props.userId,
            dname: this.props.dname,
            levelId: ""
        }
    }
    componentWillMount(){
        this.getImage();
    }
    getImage = ()=>{
        var userId = this.state.userId;
        var extArr = ['jpg', 'jpeg', 'png', 'gif', 'bs'];
        var len = extArr.length;
        var count = 0;
        for(count; count < len; count++){
            if(count <= 3) {
                let ext = extArr[count];
                storageRef.child(`${ userId }/avatar.${ext}`).getDownloadURL().then((url)=>{
                    storageRef.child(`${ userId }/avatar.${ext}`).getDownloadURL().then((url)=>{
                        this.setState({
                            avatar: url
                        });
                    }, (error)=>{
                        this.setState({
                            imessage: error,
                            levelId: "level"
                        });
                        console.log(error)
                    }).then(()=>{
                        this.setState({
                            imessage: "",
                            levelId: ""
                        })
                    });
                });
            }else{
                storageRef.child('general/avatar.jpg').getDownloadURL().then((url)=>{
                    this.setState({
                        avatar: url
                    })
                }).catch((error)=>{
                    this.setState({
                        imessage: error,
                        levelId: "level"
                    });
                }); 
            }   
        }
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
                this.setState({
                    imessage: 'Upload Complete',
                    levelId: "level"
                });
                setTimeout(this.getImage(), 2000);
            }, ()=>{
                this.setState({
                    imessage: 'There was an error!, try again.',
                    levelId: "level"
                })
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
                        <div className="roundPic">
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