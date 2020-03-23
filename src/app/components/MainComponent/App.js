import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import { confirmToken } from 'reduxFiles/dispatchers/authDispatchers';
import 'styles/App.css';
import { REDIRECT_TIMER } from 'misc/constants';
import { withRouter } from 'react-router-dom';


class App extends Component {

  componentDidMount(){
    let { checkSessionValidity } = this.props;
    let storedInfo = localStorage.getItem("genInfo");
    //if stored info is present pickout session token
    let genInfo = JSON.parse(storedInfo);
    let sessionToken = storedInfo ? genInfo.chatkitUser.token : null;

    let uid = localStorage.getItem("uid") === "null" ?
      null : localStorage.getItem("uid");

    let exists = localStorage.getItem("exists") === "null" ?
      null : localStorage.getItem("exists") === "false" ?
        false : localStorage.getItem("exists");
    
    /**Determine page to redirect to */
    if (uid) {
      console.log(genInfo)
      if (genInfo) this.props.sendGenInfo(genInfo);
      //check if user session is still valid
      if (sessionToken) checkSessionValidity(sessionToken);
      //go home if not logged out
      setTimeout(() => {
        this.goTo("/home");
      }, REDIRECT_TIMER);
    }else if (uid === null && exists === null) this.goTo("/login")
    else if (uid === null && exists === false ) this.goTo("/signup")
  }

  goTo = location => {
    const { history } = this.props;
    history.push(location);
  } 
 
  render() {
    return null;
  }
}

App.propTypes = {
  genInfo: PropTypes.object,
  info: PropTypes.object,
  loginInfo: PropTypes.object,
  chatkitUser: PropTypes.object,
  checkSessionValidity: PropTypes.func.isRequired,
  sendGenInfo: PropTypes.func.isRequired
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
