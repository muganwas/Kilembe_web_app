import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Firebase from 'firebase';
import LoginForm from './Login';
import { 
  handleEmail, 
  handlePassword, 
  handleLogin, 
  authenticate, 
  authHandler 
} from 'reduxFiles/dispatchers/authDispatchers';

const Login = props=>{
  const { error, messageId } = props;

  const goTo = (location) => {
    let history = useHistory();
    history.push(location);
  }

  const fbAuth = new Firebase.auth.FacebookAuthProvider();
  const googleAuth = new Firebase.auth.GoogleAuthProvider();
  const Signup = <span className="link" onClick={ goTo("/signup") }>Signup</span>;
  const ResetPassword = <span className="link" onClick={ goTo("/reset") }>Forgot Passowrd</span>;
  //set feedback span class
  let feedBack = error?
  "hidden":
  "feedBack";
  return(
    <div className="form">
      <span><h3>Sign in</h3></span>
      <span className={ feedBack }><FormattedMessage id={ messageId } /></span>
      <LoginForm onsubmit={ handleLogin } handleEmail={ handleEmail } handlePass={ handlePassword }/>
      { Signup }  { ResetPassword }
      <span><button id="facebook" className="icon-facebook-squared" onClick={ authenticate(fbAuth, authHandler) }> &nbsp;Sign in with Facebook</button></span>
      <span><button id="google" className="icon-google" onClick={ authenticate(googleAuth, authHandler) }> &nbsp;Sign in with Google</button></span>
    </div>
  )
}

Login.propTypes = {
  error: PropTypes.bool.isRequired,
  messageId: PropTypes.string.isRequired
}
mapStateToProps = state=>{
  return {
    messageId: state.loginInfo.messageId,
    error: state.loginInfo.error
  }
}
export default connect(mapStateToProps)(Login);

