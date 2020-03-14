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
import { View, Image } from 'react-native';
import { Redirect } from 'react-router-dom';
import styles from './styling/styles';
import mainStyles from 'styles/mainStyles';
import logo from 'styles/images/kilembe-school.png';

class Signup extends Component {
  componentDidMount(){
    let { clearAllErrors } = this.props;
    clearAllErrors();
  }

  render(){
    const { loggedIn } = this.props;
    if (loggedIn) return <Redirect to={"/home"} />
  
    return(
      <View style={mainStyles.authContainer}>
        <View style={mainStyles.logoContainer}>
          <Image style={mainStyles.logo} source={logo} resizeMode="contain" />
        </View>
        <View style={styles.divider}></View>
        <SignupForm 
          { ...this.props }
        />
      </View>
    )
  }
}

Signup.propTypes = {
  error: PropTypes.bool,
  messageId: PropTypes.string,
  signupInfo: PropTypes.object.isRequired,
  signedUp: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  clearAllErrors: PropTypes.func.isRequired,
  dispatchEmail: PropTypes.func.isRequired,
  dispatchPassword: PropTypes.func.isRequired,
  onSignup: PropTypes.func.isRequired,
  confirmPasswordMatch: PropTypes.func.isRequired,
  thirdPartyAuthHandler: PropTypes.func.isRequired
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

