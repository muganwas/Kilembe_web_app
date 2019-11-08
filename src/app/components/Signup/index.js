import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SignupForm from './SignupForm';
import { 
  handleEmail, 
  handlePassword, 
  fetchToken,
  handleLogin, 
  authenticate, 
  authHandler,
} from 'reduxFiles/dispatchers/authDispatchers';
import { Redirect } from 'react-router-dom';

class Signup extends Component {
  render(){
    const { 
      loggedIn
    } = this.props;
    //go home if logged in
    if(loggedIn){
      return <Redirect to={"/home"} />;
    }

    return(
      <div className="App">
        <span className="divider"></span>
        <SignupForm { ...this.props }/>
      </div>
    )
  }
}

Signup.propTypes = {
  error: PropTypes.bool.isRequired,
  messageId: PropTypes.string,
  loggedIn: PropTypes.bool.isRequired
}
const mapStateToProps = state => {
  return {
    messageId: state.loginInfo.messageId,
    error: state.loginInfo.error,
    loggedIn: state.loginInfo.loggedIn
  }
}
const mapDispatchToProps = dispatch => {
  return {
    fetchIdToken: (currentUser, userInfo) => {
      dispatch(fetchToken(currentUser, userInfo));
    },
    emailOnChange: event => {
      dispatch(handleEmail(event));
    },
    passwordOnChange: event => {
      dispatch(handlePassword(event));
    },
    onSubmit: () => {
      dispatch(handleLogin());
    },
    thirdPartyAuthentication: (auth, authHandler, fetchToken) => {
      dispatch(authenticate(auth, authHandler, fetchToken));
    },
    thirdPartyAuthHandler: (authData, fetchToken) => {
      dispatch(authHandler(authData, fetchToken));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup);

