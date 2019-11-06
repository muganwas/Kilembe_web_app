import React, { Component } from 'react';
import { connect } from 'react-redux';
import Rebase from 're-base';
import { FormattedMessage } from "react-intl";
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import app from '../../base';
import { confirmToken, loginConfirmed, logout } from 'reduxFiles/dispatchers/authDispatchers';
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
    constructor(){
        super();
        this.state = {
            courses: []
        };
    }
    
    componentDidMount(){
        this.fetchCourses();
        let { loginInfo, signOut, genInfo } = this.props;
        let { loggedIn } = loginInfo;
        if(!loggedIn){
            this.fetchGenInfoFromSessionStorage().then(res=>{
                if(res === "not dispatched"){
                    signOut(genInfo);
                }  
            });
        }  
    }

    componentDidUpdate(){
        let { genInfo: { info: { uid, avURL } }, loginInfo: { loggedIn }  } = this.props;
        let avatar = avURL;
        if(!loggedIn)
            this.goTo("/");
        else{
            if( avatar || (localStorage.getItem("avatar") && localStorage.getItem("avatar"))){
                base.fetch(`users/${ uid }`, {
                    context: this,
                    asArray: true
                }).then((data)=>{
                    let length = data.length;
                    if(length === 0 || length === null || length === undefined) {
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
    }

    fetchGenInfoFromSessionStorage = () => {
        return new Promise(resolve=> {
            let { updateGenInfo, confirmLoggedIn, loginInfo: { loggedIn } } = this.props;
            let storedInfo = sessionStorage.getItem('genInfo');
            storedInfo = storedInfo?JSON.parse(storedInfo):null;
            if(storedInfo){
                if(!loggedIn)
                    confirmLoggedIn();
                updateGenInfo(storedInfo);
                resolve("dispatched")
            }else{
                resolve("not dispatched");
            }
        });
    }

    updateInfo = () => {
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
        let { urls, courses } = this.state;
        let { info: { uid } } = this.props;
        return (
            <div className="container Home">
                <Header />
                <div className="content">
                    <h4><FormattedMessage id={"home.coursesTitle"} /></h4>
                    <Courses userID={ uid } videos={ urls } courses = { courses } />
                </div>
                <Footer />                               
            </div>
        )
    }
}

Home.propTypes = {
    genInfo: PropTypes.object.isRequired,
    info: PropTypes.object.isRequired,
    loginInfo: PropTypes.object.isRequired,
    confirmUserToken: PropTypes.func.isRequired,
    updateGenInfo: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        info: state.genInfo.info,
        loginInfo: state.loginInfo
    }
}

const mapDispatchToProps = dispatch => {
    return {
        confirmUserToken: userToken => {
            dispatch(confirmToken(userToken));
        },
        confirmLoggedIn: () => {
            dispatch(loginConfirmed());
        },
        signOut: genInfo => {
            dispatch(logout(genInfo));
        },
        updateGenInfo: genInfo => {
            dispatch(dispatchedGenInfo(genInfo));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Home));