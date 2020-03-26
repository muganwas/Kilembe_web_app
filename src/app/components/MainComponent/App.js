import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatchedGenInfo } from 'reduxFiles/dispatchers/genDispatchers';
import { confirmToken } from 'reduxFiles/dispatchers/authDispatchers';
import { Footer, Header, KLoader } from 'components';
import mainStyles from 'styles/mainStyles';
import { withRouter } from 'react-router-dom';
import { isMobile, isTab } from 'misc/helpers';
import 'styles/App.css';


class App extends Component {

  state = {
    courses: [],
    mobile: isMobile(),
    tab: isTab()
  }

  componentDidMount(){
    const { checkSessionValidity, sendGenInfo } = this.props;
    let storedInfo = localStorage.getItem("genInfo");
    //if stored info is present pickout session token
    storedInfo = JSON.parse(storedInfo);
    const sessionToken = storedInfo ? storedInfo.chatkitUser.token : null;
    const storedUID = localStorage.getItem("uid");
    
    /**Determine page to redirect to */
    if (storedUID) {
      if (storedInfo) sendGenInfo(storedInfo);
      //check if user session is still valid
      if (sessionToken) checkSessionValidity(sessionToken);
    }
    else this.goTo("/login")
    window.addEventListener('resize', this.resize, true);
  }

  resize = e => {
    this.setState({mobile: isMobile(e.target.innerWidth), tab: isTab(e.target.innerWidth)});
  }

  componentDidUpdate(){
    const { loginInfo: { loggedIn } } = this.props;
    if (loggedIn) this.goTo("/home");
  }

  goTo = location => {
    const { history } = this.props;
    history.push(location);
  } 

  componentWillUnmount(){
    window.removeEventListener('resize', this.resize, true);
  }
 
  render() {
    const { mobile, tab } = this.state;

    const mainContainerStyle = mobile ? 
        mainStyles.mainContainerMobi : 
        tab ? 
        mainStyles.mainContainerTab : 
        mainStyles.mainContainer;

    return (
      <View style={mainContainerStyle}>
        <Header />
        <KLoader 
          type="TailSpin"
          color="#757575"
          height={50}
          width={50}
        />
        <Footer />
      </View>
    )
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
