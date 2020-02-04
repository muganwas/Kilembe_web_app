import { Component } from 'react';
import PropTypes from 'prop-types';
//import axios from 'axios';
//redux
import { connect } from 'react-redux';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import { confirmToken } from 'reduxFiles/dispatchers/authDispatchers';

import './styles/App.css';
import { withRouter } from 'react-router-dom';


class App extends Component {

  componentDidMount(){
    let storedInfo = sessionStorage.getItem("genInfo");
    //if stored info is present pickout session token
    let sessionToken = storedInfo?JSON.parse(storedInfo).chatkitUser.token:null;
    let { checkSessionValidity, chatkitUser } = this.props;

    let uid = localStorage.getItem("uid")==="null"?
    null:
    localStorage.getItem("uid");

    let exists = localStorage.getItem("exists")==="null"?
    null:
    localStorage.getItem("exists")==="false"?
    false:
    localStorage.getItem("exists");
    
    /**Determine page to redirect to */
    if(uid !== null) {
      //check if user session is still valid
      checkSessionValidity(sessionToken);
      this.goTo("/home");
    }else if(uid === null && exists === null){
      this.goTo("/login");
    }else if(uid === null && exists === false ){
      this.goTo("/signup");
    }

    let len = chatkitUser?Object.keys(chatkitUser).length:0;
    if(len === 0){
      /**Fetch chatkit info from local storage */
      let genInfo = JSON.parse(sessionStorage.getItem('genInfo'));
      this.props.sendGenInfo(genInfo);
    }
  }

  goTo = (location) => {
    const { history } = this.props;
    history.push(location);
  } 
 
  render() {
    return false;
  }
}

App.propTypes = {
  genInfo: PropTypes.object,
  info: PropTypes.object,
  loginInfo: PropTypes.object,
  chatkitUser: PropTypes.object
}
const mapStateToProps = state => {
  return {
    genInfo: state.genInfo,
    info: state.genInfo.info,
    chatkitUser: state.genInfo.info.chatkitUser,
    loginInfo: state.loginInfo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkSessionValidity: sessionToken => {
      dispatch(confirmToken(sessionToken));
    },
    sendGenInfo: genInfo => {
      dispatch(dispatchedGenInfo(genInfo));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
