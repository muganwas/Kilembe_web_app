import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SignupForm from './SignupForm';
import { 
  handleEmail, 
  handlePassword, 
  handleConfirmPassword,
  authHandler,
  handleSignup,
  clearErrors
} from 'reduxFiles/dispatchers/authDispatchers';
import { Redirect } from 'react-router-dom';

class Signup extends Component {
  state = {
    email: "",
    password: "",
    passwordConfirm: ""
  }

  componentDidMount(){
    let { clearAllErrors } = this.props;
    clearAllErrors();
  }

  temporaryValuesStore = event => {
    let value = event.target.value;
    let id = event.target.id;
    this.setState({ [id]:value });
  }

  render(){
    const { email, password, passwordConfirm } = this.state;
    const { loggedIn } = this.props;
    if(loggedIn)
      <Redirect to={"/home"} />
  
    return(
      <div className="App">
        <span className="divider"></span>
        <SignupForm 
          { ...this.props }
          tempValStore = { this.temporaryValuesStore }
          email = {email}
          password = {password}
          passwordConfirm = {passwordConfirm}
        />
      </div>
    )
  }
}

Signup.propTypes = {
  error: PropTypes.bool,
  messageId: PropTypes.string,
  signupInfo: PropTypes.object.isRequired,
  signedUp: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired
}
const mapStateToProps = state => {
  return {
    messageId: state.signupInfo.messageId,
    error: state.signupInfo.error,
    signupInfo: state.signupInfo,
    signedUp: state.signupInfo.signedUp,
    loggedIn: state.loginInfo.loggedIn
  }
}
const mapDispatchToProps = dispatch => {
  return {
    clearAllErrors: () => {
      dispatch(clearErrors());
    },
    dispatchEmail: email => {
      dispatch(handleEmail(email));
    },
    dispatchPassword: password => {
      dispatch(handlePassword(password));
    },
    onSignup: (email, password) => {
      dispatch(handleSignup(email, password));
    },
    confirmPasswordMatch: (password, confirmPassword) => {
      dispatch(handleConfirmPassword(password, confirmPassword));
    },
    thirdPartyAuthHandler: (authData) => {
      dispatch(authHandler(authData));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup);

