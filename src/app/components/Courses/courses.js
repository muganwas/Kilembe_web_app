import React, { Component } from 'react';
import Rebase from 're-base';
import app from '../../base';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');
class Courses extends Component {
    constructor(props){
        super(props);
        this.showCourses = this.showCourses.bind(this);
        this.state = {
            linkStyle: "urls",
            playlist: {}
        }

    }
    componentWillMount(){
        if(this.props.userID !== null && this.props.userID !== undefined){
            base.syncState(`users/${ this.props.userID }/playlist`, {
                context: this,
                state: 'playlist'
            });
        }  
    }
    componentDidUpdate(){;
        if(this.props.videos !== null && this.props.videos !== undefined){
            let kaState = this.state.courses;
            if(kaState === undefined){
                this.setState({
                    videos: this.props.videos,
                    courses: this.props.courses
                });
            }
        }
    }
    goToUrl = (event)=>{
        let courseUrl = event.target.id;
        let playlist = this.props.playLProp || {};
        playlist[event.target.title] = courseUrl;
        this.setState({
            source: courseUrl,
            playlist: playlist
        });
    }
    removeItem = (key)=>{
        let playlist1 = {...this.state.playlist};
        let userID = this.props.userID;
        delete playlist1[key];
        let userRef = usersRef.child(userID);
        userRef.update({
            playlist: playlist1
        });
    }
    showPlayList = (key)=>{
        return( 
            <div className="item" key={key}>
                <ReactCSSTransitionGroup transitionName = "example"
                transitionAppear = {true} transitionAppearTimeout = {500}
                transitionEnter = { false }
                transitionLeave = {true} transitionLeaveTimeout = {500}  
                >
                    <div className="text">{key}</div><div onClick={ ()=>{this.removeItem(key)} } className="ex icon-x-circle"></div>
                    <div className="clear"></div>
                </ReactCSSTransitionGroup>  
            </div>         
        )

    }
    playlistClass = ()=>{
        let playlist = this.state.playlist;
        let plen = Object.keys(playlist).length;
        let there = "playlist";
        let notThere = "hidden";
        if(plen > 0){
            return there; 
        }else{
            return notThere;
        }
    }
    showCourses = (key)=>{
        let vids = this.state.videos;
        let courz = this.state.courses;
        let courseName = courz[key];
        let courseUrl = vids[key];
        
        return(
            <div key={key}>
                <div onClick={ this.goToUrl } id={ courseUrl } title={ courseName } className={ this.state.linkStyle }>
                    { courseName }
                </div>
                <div className="clear"></div>
            </div>
        )                
    }
    videoSource = ()=>{
        let playlist = this.state.playlist;
        let playlistLen = Object.keys(playlist).length;
        let iniVid = "https://www.youtube.com/embed/gfkTfcpWqAY";
        if(playlistLen===0 && playlist !== undefined && playlist !== null){
            return iniVid;
        }else if(playlistLen>=1){
            let vidArr = Object.values(playlist);
            let vidArrLen = vidArr.length;
            let count = 1;
            let pLUrl = vidArr[0] + "?enablejsapi=1&playlist=";
            for(count; count<vidArrLen; count++){
                let currUrl = vidArr[count];
                let currUrlArr = currUrl.split('/');
                let vidId = currUrlArr[4];
                if(count<(vidArrLen-1) && currUrl === vidArr[0]){
                    pLUrl += "";
                }
                else if(count<(vidArrLen-1)){
                    pLUrl += vidId + ",";
                }else{
                    pLUrl += vidId;
                } 
            }
            return pLUrl;
        }
    }
    render(){
        let plstk = this.state.playlist || {};
        if(this.state.videos !== undefined){  
            return(
                <div>
                    <div className="group">
                        { Object.keys( this.state.videos ).map(this.showCourses) }
                    </div>
                    <div className="tutorial">
                        <header>Course Video</header>
                        <iframe className="youtube" title="tutorial video" src={ this.videoSource() }
                        frameBorder="0" allowFullScreen></iframe>
                    </div>
                    <div className={ this.playlistClass() }>
                    <header>Your Playlist</header>
                       <span>{ Object.keys(plstk).map(this.showPlayList) }</span>
                    </div>
                    <div className="clear"></div>
                </div>
            )
        }else{
            return(
                <div>
                </div>
            )
        }
    }
}

export default Courses;