import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ResetForm from './ResetForm';
import { 
  handleEmail, 
  handlePasswordReset,
  clearErrors
} from 'reduxFiles/dispatchers/authDispatchers';
import { Redirect } from 'react-router-dom';

class Reset extends Component {
  state = {
    email: ""
  }

  componentDidMount(){
    let { clearAllErros } = this.props;
    clearAllErros();
  }

  temporaryValuesStore = event => {
    let value = event.target.value;
    let id = event.target.id;
    this.setState({ [id]:value });
  }

  render(){
    const { email } = this.state;
    const { loggedIn } = this.props;
    if(loggedIn)
      <Redirect to={"/home"} />
  
    return(
      <div className="App">
        <span className="divider"></span>
        <ResetForm 
          { ...this.props }
          tempValStore = { this.temporaryValuesStore }
          email = { email } 
        />
      </div>
    )
  }
}

Reset.propTypes = {
  feedback: PropTypes.bool,
  messageId: PropTypes.string,
  resetInfo: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  reset: PropTypes.bool.isRequired
}
const mapStateToProps = state => {
  return {
    messageId: state.resetInfo.messageId,
    feedback: state.resetInfo.feedback,
    resetInfo: state.resetInfo,
    reset: state.resetInfo.reset,
    loggedIn: state.loginInfo.loggedIn
  }
}
const mapDispatchToProps = dispatch => {
  return {
    dispatchEmail: email => {
      dispatch(handleEmail(email));
    },
    clearAllErros: ()=>{
      dispatch(clearErrors());
    },
    onReset: email => {
      dispatch(handlePasswordReset(email));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Reset);

