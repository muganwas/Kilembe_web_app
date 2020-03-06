import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Header,
    Footer,
    KLoader
} from 'components';
import {
    fetchUsers,
    fetchFriends,
    fetchFriendsRequests
} from 'reduxFiles/dispatchers/userDispatchers';
import { FormattedMessage } from 'react-intl';
import { 
    loginConfirmed, 
    checkLoginStatus 
} from 'reduxFiles/dispatchers/authDispatchers';

class Friends extends Component {
    
    componentDidMount(){
        const { 
            confirmLoggedIn, 
            genInfo, 
            loginInfo, 
            logingStatusConfirmation
        } = this.props
        logingStatusConfirmation(confirmLoggedIn, loginInfo, genInfo);
    }

    userDetail =  key => {
        this.goTo(`/friends/${key}`);
    }

    incoming = key => {
        let { friendsInfo: { inComingRequests, responseRequired, users } } = this.props;;
        let len = inComingRequests.length;
        for(let count = 0; count < len; count++){
            let currUser = users[key].uid;
            if(inComingRequests[count] === currUser){
                return <span className={ responseRequired }></span>;
            }
        } 
    }

    getUsers = key => {
        let { friendsInfo: { users, peopleListStyle, defaultAvatar }, genInfo: { info: { uid } } } = this.props;
        let loggedInUser = uid;
        let uCount = users.length;
        let userImg = users[key].avatar || defaultAvatar;
        let dname = users[key].dname;
        let usersId = users[key].uid;
        if(uCount !== 0 && loggedInUser !== usersId && dname){
            return(
                <div title={ dname } id={ usersId } key={key} className={ peopleListStyle } onClick={ ()=>{ this.userDetail(key) } }>
                    <div className="roundPic membersAv">
                        <img alt={ key } className="members" src={ userImg } />
                    </div>
                    <div className="pfriends">
                        { users[key].dname }
                        { this.incoming(key) }
                    </div>
                </div>
            )
        }
    }

    goTo = location => {
        const { history } = this.props;
        history.push(location);
    } 

    render(){
        let { friendsInfo: { users } } = this.props;
        let usersLength = users.length;
        return (
            <div className="container Home">
                <Header />
                <div className="content">
                    <h4 id="users-title"><FormattedMessage id="users.title" /></h4>
                    <div className="sub-container">
                        { 
                            usersLength ?
                            Object.keys(users).map(this.getUsers) :
                            <KLoader 
                                type="TailSpin"
                                color="#757575"
                                height={50}
                                width={50}
                            />
                        }
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

Friends.propTypes = {
    friendsInfo: PropTypes.object.isRequired,
    loginInfo: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired,
    getUsers: PropTypes.func.isRequired,
    getFriends: PropTypes.func.isRequired,
    logingStatusConfirmation: PropTypes.func.isRequired,
    confirmLoggedIn: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        friendsInfo: state.friendsInfo,
        loginInfo: state.loginInfo,
        genInfo: state.genInfo
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUsers: ()=>{
            dispatch(fetchUsers());
        },
        getFriends: info=>{
            dispatch(fetchFriends(info));
        },
        logingStatusConfirmation: (confirmLoggedIn, loginInfo, genInfo) => {
            dispatch(checkLoginStatus(confirmLoggedIn, loginInfo, genInfo));
        },
        confirmLoggedIn: () => {
            dispatch(loginConfirmed());
        },
        getFriendsRequests: info => {
            dispatch(fetchFriendsRequests(info));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Friends));