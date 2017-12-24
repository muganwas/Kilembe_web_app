import React, { Component } from 'react';

class Courses extends Component {
    constructor(props){
        super(props);
        this.showCourses = this.showCourses.bind(this);
        this.state = {
            source: "https://www.youtube.com/embed/gfkTfcpWqAY",
            linkStyle: "urls",
            playlist: {}
        }

    }
    componentDidUpdate(){
        let vids = this.props.videos;
        let courz = this.props.courses;
        if(vids !== null && vids !== undefined){
            let kaState = this.state.courses;
            if(kaState === undefined){
                this.setState({
                    videos: vids,
                    courses: courz
                });
            }
        } 
    }
    //alternative to binding
    goToUrl = (event)=>{
        let courseUrl = event.target.id;
        let playlist = this.state.playlist;
        playlist[event.target.title] = courseUrl;
        this.setState({
            source: courseUrl,
            playlist: playlist
        });
    }
    showCourses(key){
        let vids = this.state.videos;
        let courz = this.state.courses;
        let courseName = courz[key];
        let courseUrl = vids[key];
        
        return(
            <div key={key}>
                <div className="course">
                    { courseName }
                </div>
                <div onClick={ this.goToUrl } id={ courseUrl } title={ courseName } className={ this.state.linkStyle }>
                    { courseName + " Video" }
                </div>
                <div className="clear"></div>
            </div>
        )                
    }
    render(){
        let chcker = this.state.videos;
        let sendPlaylist =  this.props.playlist;
        sendPlaylist(this.state.playlist);
        if(chcker !== undefined){  
            return(
                <div>
                    <div className="group">
                        { Object.keys(chcker).map(this.showCourses) }
                    </div>
                    <div className="tutorial">
                    <header>Course Video</header>
                        <iframe className="youtube" title="tutorial video" src={ this.state.source }
                        frameBorder="0" allowFullScreen></iframe>
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