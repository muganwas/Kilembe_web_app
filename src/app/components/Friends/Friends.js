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
import { View, Text, TouchableOpacity, Image } from 'react-native';
import NotificationIcon from '@material-ui/icons/NotificationsActive';
import { isMobile, isTab } from 'misc/helpers';
import mainStyles from 'styles/mainStyles';
import styles from './styling/styles';

class Friends extends Component {
    state={
        mobile: isMobile(),
        tab: isTab()
    }
    
    componentDidMount(){
        const { 
            confirmLoggedIn, 
            genInfo, 
            loginInfo, 
            logingStatusConfirmation
        } = this.props
        logingStatusConfirmation(confirmLoggedIn, loginInfo, genInfo);
        
        window.addEventListener('resize', this.resize, true);
    }

    resize = e => {
        this.setState({mobile: isMobile(e.target.innerWidth), tab: isTab(e.target.innerWidth)});
    }

    userDetail =  key => {
        this.goTo(`/friends/${key}`);
    }

    incoming = key => {
        let { friendsInfo: { inComingRequests, users } } = this.props;;
        let len = inComingRequests.length;
        for (let count = 0; count < len; count++) {
            let currUser = users[key].uid;
            if (inComingRequests[count] === currUser) return <NotificationIcon fontSize="small" style={styles.notificationIcon} />;
        } 
    }

    getUsers = key => {
        let { friendsInfo: { users, defaultAvatar }, genInfo: { info: { uid } } } = this.props;
        let loggedInUser = uid;
        let uCount = users.length;
        let userImg = users[key].avatar || defaultAvatar;
        let dname = users[key].dname;
        let usersId = users[key].uid;
        if (uCount !== 0 && loggedInUser !== usersId && dname) {
            return(
                <TouchableOpacity style={styles.userInfoContainer} title={ dname } id={ usersId } key={key} onPress={ () => this.userDetail(key) }>
                    <View style={styles.userInfo}>
                        <Image alt={ key } style={styles.roundPic} source={ userImg } />
                        <Text style={styles.userTextInfoContainer}>
                            <Text style={styles.username}>{ users[key].dname }</Text>
                            { this.incoming(key) }
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    goTo = location => {
        const { history } = this.props;
        history.push(location);
    } 

    componentWillUnmount(){
        window.removeEventListener('resize', this.resize, true);
    }

    render(){
        const { mobile, tab } = this.state;
        const { friendsInfo: { users } } = this.props;
        const usersLength = users.length;

        const mainContainerStyle = mobile ? 
        mainStyles.mainContainerMobi : 
        tab ? 
        mainStyles.mainContainerTab : 
        mainStyles.mainContainer;

        return (
            <View style={mainContainerStyle}>
                <Header />
                <View style={mobile ? mainStyles.contentMobi : mainStyles.content}>
                    <Text style={mainStyles.title}><FormattedMessage id="users.title" /></Text>
                    <View style={styles.subContainer}>
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
                    </View>
                </View>
                <Footer />
            </View>
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
    confirmLoggedIn: PropTypes.func.isRequired,
    getFriendsRequests: PropTypes.func.isRequired
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