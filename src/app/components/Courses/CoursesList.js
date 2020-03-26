import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Rebase from 're-base';
import app from 'misc/base';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styling/styles';
import { Button } from 'components';
import { mdiCloseCircleOutline } from '@mdi/js';
import { isMobile } from 'misc/helpers';

let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');

class CoursesList extends Component {
    state = {
        playlistFetched: false,
        playlist: {},
        mobile: isMobile()
    }

    componentDidMount(){
        const { genInfo: { info: { uid } } } = this.props;
        this.getLessonPlaylist(uid);

        window.addEventListener('resize', this.resize, true);
    }

    /**Event listeners start */
    resize = e => {
        this.setState({mobile:isMobile(e.target.innerWidth)});
    }
    /**Event listeners end */
    
    componentDidUpdate(){
        const { videos, courses, userID } = this.props;
        const { courses: stateCourses } = this.state;
        this.getLessonPlaylist(userID);
        if (videos) {
            if ( stateCourses === undefined ) {
                this.setState({
                    videos: videos,
                    courses: courses
                });
            }
        }  
    }

    getLessonPlaylist = uid => {
        const { playlistFetched } = this.state;
        if (uid && !playlistFetched) {
            base.fetch(`users/${ uid }/playlist`, {
                context: this,
                asArray: false
            }).then(playlist => {
                this.setState({ playlist, playlistFetched: true });
            });
        }  
    }
    
    addToPlaylist = (title, url) => {
        const { playlist } = this.state;
        const { userID } = this.props;
        playlist[title] = url;
        this.setState({
            source: url,
            playlist
        });
        const userRef = usersRef.child(userID);
        userRef.update({
            playlist
        });
    }

    removeItem = key => {
        const { playlist } = this.state;
        const { userID } = this.props;
        let playlist1 = Object.assign({}, playlist);
        delete playlist1[key];
        this.setState({ playlist: playlist1 });
        let userRef = usersRef.child(userID);
        userRef.update({
            playlist: playlist1
        });
    }

    showPlayList = key => {
        return( 
            <View style={styles.item} key={key}>
                <Text style={styles.text}>{key}</Text>
                <Button
                    style={styles.closeButtonStyle}
                    hoveredColor='#FDD906'
                    iconPath={mdiCloseCircleOutline}
                    iconColor='white'
                    onPress={()=>this.removeItem(key)}
                    size={0.6}
                />
            </View>         
        )
    }

    showCourses = key => {
        const { videos, courses } = this.state;
        const vids = videos;
        const courseName = courses[key];
        const courseUrl = vids[key];
        
        return(
            <View key={key}>
                <TouchableOpacity onPress={() => this.addToPlaylist(courseName, courseUrl)} style={ styles.course }>
                    <Text style={styles.courseListText}>{ courseName }</Text>
                </TouchableOpacity>
            </View>
        )                
    }

    videoSource = () => {
        const { playlist } = this.state;
        const playlistLen = Object.keys(playlist).length;
        const iniVid = "https://www.youtube.com/embed/gfkTfcpWqAY";
        if ( playlistLen === 0 && playlist !== undefined && playlist !== null) return iniVid;
        else if ( playlistLen >= 1 ) {
            let vidArr = Object.values(playlist);
            let vidArrLen = vidArr.length;
            let count = 1;
            let pLUrl = vidArr[0] + "?enablejsapi=1&playlist=";
            for (count; count<vidArrLen; count++) {
                let currUrl = vidArr[count];
                let currUrlArr = currUrl.split('/');
                let vidId = currUrlArr[4];

                if (count < (vidArrLen-1) && currUrl === vidArr[0]) pLUrl += "";
                else if (count < (vidArrLen-1)) pLUrl += vidId + ",";
                else pLUrl += vidId;
            }
            return pLUrl;
        }
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.resize, true);
    }
    
    render(){
        const { playlist, videos, mobile } = this.state;
        const showPlaylist = Object.keys(playlist).length > 0;
        return(
            <View>
                { videos ?
                    <View style={mobile ? styles.tutorialContainerMobi : styles.tutorialContainer}>
                        <View style={styles.courseListContainer}>
                            <View style={styles.courseList}>
                                { Object.keys(videos).map(this.showCourses) }
                            </View>
                        </View>
                        <View style={styles.tutorial}>
                            <Text style={styles.header}><FormattedMessage id={"courses.videoTitle"} /></Text>
                            <iframe 
                                className="youtube" 
                                title="tutorial video" 
                                src={this.videoSource()}
                                frameBorder="0" 
                                allowFullScreen
                            ></iframe>
                        </View>
                        
                            <View style={styles.playlistContainer}>
                            { showPlaylist ? 
                                <View style={styles.playlist}>
                                    <Text style={styles.header}><FormattedMessage id={"playlist.title"} /></Text>
                                    <View>{ Object.keys(playlist).map(this.showPlayList) }</View>
                                </View> : 
                            null }
                            </View> 
                    </View> :
                null }
            </View>
        )
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