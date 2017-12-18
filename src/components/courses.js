import React, { Component } from 'react';

class Courses extends Component {
    constructor(props){
        super(props);
        this.showCourses = this.showCourses.bind(this);
        this.goToUrl = this.goToUrl.bind(this);
        this.state = {
            source: "https://www.youtube.com/embed/gfkTfcpWqAY",
            linkStyle: "urls"
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
    goToUrl(event){
        let url = event.target.innerText;
        this.setState({
            source: url
        });
    }
    showCourses(key){
        let vids = this.state.videos;
        let courz = this.state.courses;
        return(
            <div key={key}>
                <div className="course">
                    { courz[key] }
                </div>
                <div onClick={ this.goToUrl } className={ this.state.linkStyle }>
                    { vids[key] }
                </div>
                <div className="clear"></div>
            </div>
        )                
    }
    render(){
        let chcker = this.state.videos;
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