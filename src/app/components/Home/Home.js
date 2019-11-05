import React, { Component } from 'react';
import { connect } from 'react-redux';
import Rebase from 're-base';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import app from '../../base';
import { confirmToken } from 'reduxFiles/dispatchers/authDispatchers';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import { 
    Courses,
    Header,
    Footer
} from 'components';
import { getUserAvatar } from 'misc/functions';

let base = Rebase.createClass(app.database());
let usersRef = app.database().ref('users');


class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            courses: {}
        };
    }
    
    componentDidMount(){
        this.fetchCourses();
        let { genInfo } = this.props;
        let { info: { avURL } } = genInfo;
        //console.log("genInfo")
        //console.log(genInfo);
        if(!avURL){
            this.fetchGenInfoFromSessionStorage().then(res=>{
                if(res === "not dispatched"){
                    this.logout();
                }  
            });
        }  
    }

    componentDidUpdate(){
        let { genInfo: { info: { uid, avURL } } } = this.props;
        let avatar = avURL;
        if((avatar !== null && avatar !== undefined) || (localStorage.getItem("avatar") !== null && localStorage.getItem("avatar") !== undefined)){
            base.fetch(`users/${ uid }`, {
                context: this,
                asArray: true
            }).then((data)=>{
                let length = data.length;
                if(length === 0 || length === null || length === undefined) {
                    console.log("uid " + uid)
                    let userRef = usersRef.child(uid);
                    userRef.set({
                        email: localStorage.getItem('email'),
                        dname: localStorage.getItem('dname'),
                        uid: localStorage.getItem('uid'),
                        about: " ",
                        shareEmailAddress: false,
                        avatar: localStorage.getItem("avatar") || avatar
                    });
                }
            });
        }else{
            getUserAvatar(uid);
            //setTimeout(()=>{this.updateInfo()}, 2000);
        }
    }

    logout = ()=>{
        let { genInfo, updateGenInfo } = this.props;
        genInfo.info = {};
        app.auth().signOut().then(()=>{
            sessionStorage.removeItem('genInfo');
            localStorage.clear();
            updateGenInfo(genInfo);
            console.log("user signed out!");
            this.goTo('/');
        });
    }

    fetchGenInfoFromSessionStorage = () => {
        return new Promise(resolve=> {
            let { updateGenInfo } = this.props;
            let storedInfo = sessionStorage.getItem('genInfo');
            storedInfo = storedInfo?JSON.parse(storedInfo):null;
            if(storedInfo){
                updateGenInfo(storedInfo);
                resolve("dispatched")
            }else{
                resolve("not dispatched");
            }
        });
    }

    updateInfo = ()=>{
        let { getnInfo: { info: { uid, avatar } } } = this.props;
        let userRef = usersRef.child(uid);
        userRef.update({
            email: localStorage.getItem('email'),
            dname: localStorage.getItem('dname'),
            uid: localStorage.getItem('uid'),
            about: " ",
            shareEmailAddress: false,
            avatar: localStorage.getItem("avatar") === undefined?avatar === undefined?{}:avatar : localStorage.getItem("avatar")
        });
    }

    fetchCourses = () => {
        var currUser = app.auth().currentUser;
        var courses = [];
        var videos = [];
        base.fetch(`courses`, {
            context: this,
            asArray: true
        }).then((info)=>{
            let length = info.length; 
            if(length!==0 && length!=null) {
                for(var count =0; count<length; count++){
                    let course = info[count]['Course_Title'];
                    let vidUrl = info[count]['Video']
                    courses[count] = course;
                    videos[count] = vidUrl;
                }
                this.setState({
                    currentUser: JSON.stringify(currUser),
                    courses: courses,
                    urls: videos
                }); 
            } 
        });        
    }

    goTo = (location) => {
        const { history } = this.props;
        history.push(location);
    } 

    render(){   
        return (
            <div className="container Home">
                <Header logout = { this.logout } goTo={ this.goTo } />
                <div className="content">
                    <h4>Available Courses</h4>
                    <Courses userID={this.props.uid} videos={ this.state.urls } courses = { this.state.courses } />
                </div>
                <Footer />                               
            </div>
        )
    }
}

Home.propTypes = {
    genInfo: PropTypes.object.isRequired,
    info: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        info: state.genInfo.info
    }
}

const mapDispatchToProps = dispatch => {
    return {
        confirmUserToken: userToken => {
            dispatch(confirmToken(userToken));
        },
        updateGenInfo: genInfo => {
            dispatch(dispatchedGenInfo(genInfo));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Home));