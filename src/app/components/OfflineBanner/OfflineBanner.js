import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { updateOnlineStatus } from 'reduxFiles/dispatchers/genDispatchers';
import { View, Text } from 'react-native';
import styles from './styling/styles';

const OfflineBanner = ({ online, updateConnectivity, containerStyle, textStyle=styles.infoText }) => {

  useEffect(() => {
    /**check whether online*/
    window.addEventListener('online', onlineCheck, true);
    window.addEventListener('offline', offlineCheck, true);
  }, []);

  useEffect(() => {
    console.log(`Online: ${online}`);
    
    return () => {
      window.removeEventListener('online', onlineCheck, true);
      window.removeEventListener('offline', offlineCheck, true)
    }
  });

  const onlineCheck = () => {
    updateConnectivity(true);
  }

  const offlineCheck = () => {
    updateConnectivity(false);
  }

  return (
    <View style={ online ? styles.containerOnline : containerStyle || styles.container}>
      <Text style={textStyle}>
        <FormattedMessage id="error.offlineMessage" />
      </Text>
    </View>
  )
}

OfflineBanner.propTypes = {
  online: PropTypes.bool.isRequired,
  updateConnectivity: PropTypes.func.isRequired,
  containerStyle: PropTypes.number || PropTypes.string,
  textStyle: PropTypes.number || PropTypes.string,
}

const mapStateToProps = state => {
  return {
    online: state.genInfo.online
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateConnectivity: status => {
      dispatch(updateOnlineStatus(status));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OfflineBanner);

