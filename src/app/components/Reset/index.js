import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ResetForm from './ResetForm';
import { OfflineBanner } from 'components';
import { 
  handleEmail, 
  handlePasswordReset,
  clearErrors
} from 'reduxFiles/dispatchers/authDispatchers';
import { View, Image } from 'react-native';
import { Redirect } from 'react-router-dom';
import styles from './styling/styles';
import mainStyles from 'styles/mainStyles';
import logo from 'styles/images/kilembe-school.png';

class Reset extends Component {

  componentDidMount(){
    let { clearAllErros } = this.props;
    clearAllErros();
  }

  render(){
    const { loggedIn } = this.props;
    if (loggedIn) return <Redirect to={"/home"} />
  
    return(
      <View style={mainStyles.authContainer}>
        <OfflineBanner containerStyle={mainStyles.authOfflineBannerContainer} />
        <View style={mainStyles.logoContainer}>
          <Image style={mainStyles.logo} source={logo} resizeMode="contain" />
        </View>
        <View style={styles.divider}></View>
        <ResetForm 
          { ...this.props }
        />
      </View>
    )
  }
}

Reset.propTypes = {
  feedback: PropTypes.bool,
  messageId: PropTypes.string,
  resetInfo: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  reset: PropTypes.bool.isRequired,
  dispatchEmail: PropTypes.func.isRequired,
  clearAllErros: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  online: PropTypes.bool.isRequired
}
const mapStateToProps = state => {
  return {
    messageId: state.resetInfo.messageId,
    feedback: state.resetInfo.feedback,
    resetInfo: state.resetInfo,
    reset: state.resetInfo.reset,
    loggedIn: state.loginInfo.loggedIn,
    online: state.genInfo.online
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

