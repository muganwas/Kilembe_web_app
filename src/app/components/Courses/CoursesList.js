import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Rebase from 're-base';
import app from '../../base';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

class CoursesList extends Component {
    constructor(){
        super();
        this.state = {
            linkStyle: "urls",
            playlistFetched: false,
            playlist: {}
        }

    }

    componentDidMount(){
        let { genInfo: { info: { uid } } } = this.props;
        this.getLessonPlaylist(uid);
    }
    
    componentDidUpdate(){
        let { videos, courses, userID } = this.props;
        let { courses: stateCourses } = this.state;
        this.getLessonPlaylist(userID);
        if(videos){
            if( stateCourses === undefined ){
                this.setState({
                    videos: videos,
                    courses: courses
                });
            }
        }  
    }

    getLessonPlaylist = (uid) => {
        let { playlistFetched } = this.state;
        if(uid && !playlistFetched){
            base.fetch(`users/${ uid }/playlist`, {
                context: this,
                asArray: false
            }).then(playlist=>{
                this.setState({ playlist, playlistFetched: true });
            });
        }  
    }
    
    addToPlaylist = (event)=>{
        let { playlist } = this.state;
        let { userID } = this.props;
        let courseUrl = event.target.id;
        playlist[event.target.title] = courseUrl;
        this.setState({
            source: courseUrl,
            playlist
        });
        let userRef = usersRef.child(userID);
        userRef.update({
            playlist
        });
    }

    removeItem = (key)=>{
        let { playlist } = this.state;
        let { userID } = this.props;
        let playlist1 = { ...playlist };
        delete playlist1[key];
        this.setState({ playlist: playlist1 });
        let userRef = usersRef.child(userID);
        userRef.update({
            playlist: playlist1
        });
    }

    showPlayList = (key) => {
        return( 
            <div className="item" key={key}>
                <ReactCSSTransitionGroup 
                    transitionName = "example"
                    transitionAppear = {true} transitionAppearTimeout = {500}
                    transitionEnter = { false }
                    transitionLeave = {true} transitionLeaveTimeout = {500}  
                >
                    <div className="text">{key}</div><div onClick={ ()=>this.removeItem(key) } className="ex icon-x-circle"></div>
                    <div className="clear"></div>
                </ReactCSSTransitionGroup>  
            </div>         
        )

    }

    playlistClass = () => {
        let { playlist } = this.state;
        let playlistlen = Object.keys(playlist).length;
        let there = "playlist";
        let notThere = "hidden";
        if(playlistlen > 0){
            return there; 
        }else{
            return notThere;
        }
    }

    showCourses = (key) => {
        let { videos, courses, linkStyle } = this.state;
        let vids = videos;
        let courseName = courses[key];
        let courseUrl = vids[key];
        
        return(
            <div key={key}>
                <div onClick={ this.addToPlaylist } id={ courseUrl } title={ courseName } className={ linkStyle }>
                    { courseName }
                </div>
                <div className="clear"></div>
            </div>
        )                
    }

    videoSource = () => {
        let { playlist } = this.state;
        let playlistLen = Object.keys(playlist).length;
        let iniVid = "https://www.youtube.com/embed/gfkTfcpWqAY";
        if( playlistLen === 0 && playlist !== undefined && playlist !== null){
            return iniVid;
        }else if( playlistLen >= 1 ){
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
        let { playlist, videos } = this.state;
        if(videos){  
            return(
                <div>
                    <div className="group">
                        { Object.keys( videos ).map(this.showCourses) }
                    </div>
                    <div className="tutorial">
                        <header><FormattedMessage id={"courses.videoTitle"} /></header>
                        <iframe className="youtube" title="tutorial video" src={ this.videoSource() }
                        frameBorder="0" allowFullScreen></iframe>
                    </div>
                    <div className={ this.playlistClass() }>
                    <header><FormattedMessage id={"playlist.title"} /></header>
                       <span>{ Object.keys(playlist).map(this.showPlayList) }</span>
                    </div>
                    <div className="clear"></div>
                </div>
            )
        }else{
            return false;
        }
    }
}

CoursesList.propTypes = {
    genInfo: PropTypes.object,
    userID: PropTypes.string,
    videos: PropTypes.array,
    courses: PropTypes.array
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo
    }
}
export default connect(mapStateToProps)(CoursesList);