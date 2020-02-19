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
import { Redirect } from 'react-router-dom';

class Login extends Component {
  state = {
    email: "",
    password: ""
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
    const { 
      loggedIn
    } = this.props;
    const {
      email,
      password
    } = this.state;
    //go home if logged in
    if (loggedIn) return <Redirect to={"/home"} />

    return(
      <div className="App">
        <span className="divider"></span>
        <LoginForm 
          { ...this.props }
          tempValStore = { this.temporaryValuesStore }
          email = { email }
          password = { password }
        />
      </div>
    )
  }
}

Login.propTypes = {
  error: PropTypes.bool,
  messageId: PropTypes.string,
  loginInfo: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired
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

