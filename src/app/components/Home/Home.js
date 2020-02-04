import React, { Component } from 'react';
import { connect } from 'react-redux';
import Rebase from 're-base';
import { FormattedMessage } from "react-intl";
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import app from '../../base';
import { 
    confirmToken, 
    loginConfirmed, 
    logout, 
    checkLoginStatus
} from 'reduxFiles/dispatchers/authDispatchers';
import {
    fetchUsers
} from 'reduxFiles/dispatchers/userDispatchers';
import { 
    dispatchedGenInfo 
} from 'reduxFiles/dispatchers/genDispatchers';
import { 
    Courses,
    Header,
    Footer
} from 'components';

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
        const { 
            confirmLoggedIn, 
            genInfo, 
            loginInfo,
            logingStatusConfirmation 
        } = this.props
        this.fetchCourses();
        logingStatusConfirmation(confirmLoggedIn, loginInfo, genInfo);
    }

    componentDidUpdate(){
        let { 
            loginInfo: { loggedIn }
        } = this.props;
        // const usersLength = Object.keys(users).length;
        if(!loggedIn)
            this.goTo("/");
    }

    updateInfo = () => {
        let { genInfo: { info: { uid, avatar } } } = this.props;
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
        let { genInfo: { info } } = this.props;
        let uid = info?info.uid:null;
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
    loginInfo: PropTypes.object.isRequired,
    confirmUserToken: PropTypes.func.isRequired,
    updateGenInfo: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        genInfo: state.genInfo,
        loginInfo: state.loginInfo,
        friendsInfo: state.friendsInfo
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUsers: ()=>{
            dispatch(fetchUsers());
        },
        confirmUserToken: userToken => {
            dispatch(confirmToken(userToken));
        },
        logingStatusConfirmation: (confirmLoggedIn, loginInfo, genInfo) => {
            dispatch(checkLoginStatus(confirmLoggedIn, loginInfo, genInfo));
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