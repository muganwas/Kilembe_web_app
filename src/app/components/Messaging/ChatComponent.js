import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import styles from './localStyles/mainStyles';

const ChatComponent = ({chatInfo: { selectedUser }, friendsInfo: { users }}) => {
  useEffect(() => {
    //console.log(chatInfo)
  }, [])
  return (
    <View style={styles.chatContainer}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          { users.map(user => {
            if (user.uid === selectedUser ) return user.dname
          })}
        </Text>
      </View>
      <View style={styles.messages}>
        <Text></Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="type message..."
        />
        <TouchableOpacity style={styles.button} >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

ChatComponent.propTypes = {
  genInfo: PropTypes.object.isRequired,
  chatInfo: PropTypes.object.isRequired,
  friendsInfo: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
      genInfo: state.genInfo,
      loginInfo: state.loginInfo,
      friendsInfo: state.friendsInfo,
      chatInfo: state.chatInfo
  }
}

const mapDispatchToProps = dispatch => {
  return {
      getUsers: () => {
          dispatch(fetchUsers());
      },
      getFriends: info => {
          dispatch(fetchFriends(info));
      },
      logingStatusConfirmation: (confirmLoggedIn, loginInfo) => {
          dispatch(checkLoginStatus(confirmLoggedIn, loginInfo));
      },
      openSocket: props => {
          dispatch(connectToChatServer(props));
      },
      confirmLoggedIn: () => {
          dispatch(loginConfirmed());
      },
      signOut: genInfo => {
          dispatch(logout(genInfo));
      },
      updateGenInfo: genInfo => {
          dispatch(dispatchedGenInfo(genInfo));
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatComponent);