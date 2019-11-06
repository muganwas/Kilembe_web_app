import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  FormattedMessage, 
  injectIntl
} from 'react-intl';
import PropTypes from 'prop-types';
import Firebase from 'firebase/app';
import LoginForm from './LoginForm';
import { 
  handleEmail, 
  handlePassword, 
  fetchToken,
  handleLogin, 
  authenticate, 
  authHandler,
} from 'reduxFiles/dispatchers/authDispatchers';
import { Link, Redirect } from 'react-router-dom';

class Login extends Component {
  render(){
    const { 
      error, 
      messageId, 
      thirdPartyAuthentication, 
      thirdPartyAuthHandler, 
      fetchIdToken,
      loggedIn,
      intl 
    } = this.props;
    //go home if logged in
    if(loggedIn){
      return <Redirect to={"/home"} />;
    }
    const loginLabel = intl.formatMessage({id:"auth.loginLabel"});
    const signupLabel = intl.formatMessage({id:"auth.signupLabel"});
    const forgotPasswordLabel = intl.formatMessage({id:"auth.forgotPasswordLabel"});
    const facebookLoginLabel = intl.formatMessage({id:"auth.facebookLoginLabel"});
    const googleLoginLabel = intl.formatMessage({id:"auth.googleLoginLabel"});
    const fbAuth = new Firebase.auth.FacebookAuthProvider();
    const googleAuth = new Firebase.auth.GoogleAuthProvider();

    return(
      <div className="App">
        <span className="divider"></span>
        <div className="form">
          <span><h3>{ loginLabel }</h3></span>
          { 
            error?
            <span className={ 'feedback' }><FormattedMessage id={ messageId } /></span>: 
            null 
          }
          <LoginForm { ...this.props }/>
          <Link className="link span" to = { "/signup" }>{ signupLabel }</Link> 
          <Link className="link span" to={ "/reset" }>{ forgotPasswordLabel }</Link>
          <span>
            <button 
              id="facebook" 
              className="icon-facebook-squared" 
              onClick={ ()=>thirdPartyAuthentication( fbAuth, thirdPartyAuthHandler, fetchIdToken ) }
            >
              { facebookLoginLabel }
            </button>
          </span>
          <span>
            <button 
              id="google" 
              className="icon-google" 
              onClick={ ()=>thirdPartyAuthentication( googleAuth, thirdPartyAuthHandler, fetchIdToken ) }
            >
              { googleLoginLabel }
            </button>
          </span>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
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
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Login));

