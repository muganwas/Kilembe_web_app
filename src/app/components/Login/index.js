import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import { 
  handleEmail, 
  handlePassword, 
  handleLogin, 
  authenticate, 
  authHandler,
  clearErrors
} from 'reduxFiles/dispatchers/authDispatchers';
import { View, Image } from 'react-native';
import { Redirect } from 'react-router-dom';
import styles from './styling/styles';
import mainStyles from 'styles/mainStyles';
import logo from 'styles/images/kilembe-school.png';

class Login extends Component {
  componentDidMount(){
    let { clearAllErrors } = this.props;
    clearAllErrors();
  }

  render(){
    const { 
      loggedIn
    } = this.props;
    //go home if logged in
    if (loggedIn) return <Redirect to={"/home"} />

    return(
      <View style={mainStyles.authContainer}>
        <View style={mainStyles.logoContainer}>
          <Image style={mainStyles.logo} source={logo} resizeMode="contain" />
        </View>
        <View style={styles.divider}></View>
        <LoginForm 
          { ...this.props }
        />
      </View>
    )
  }
}

Login.propTypes = {
  error: PropTypes.bool,
  messageId: PropTypes.string,
  loginInfo: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  clearAllErrors: PropTypes.func.isRequired,
  dispatchEmail: PropTypes.func.isRequired,
  dispatchPassword: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  thirdPartyAuthentication: PropTypes.func.isRequired,
  thirdPartyAuthHandler: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    messageId: state.loginInfo.messageId,
    error: state.loginInfo.error,
    loginInfo: state.loginInfo,
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
    onSubmit: loginProps => {
      dispatch(handleLogin(loginProps));
    },
    thirdPartyAuthentication: (auth, authHandler) => {
      dispatch(authenticate(auth, authHandler));
    },
    thirdPartyAuthHandler: authData => {
      dispatch(authHandler(authData));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);

