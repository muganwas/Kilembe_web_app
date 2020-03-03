import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  logout, 
  loginConfirmed,
  connectToChatServer,
  socket
} from 'reduxFiles/dispatchers/authDispatchers';
import { FormattedMessage } from 'react-intl';
import {
  dispatchSentMessage
} from 'reduxFiles/dispatchers/chatDispatchers';
import { TextInput, TouchableOpacity, Text, View, ScrollView} from 'react-native';
import styles from './localStyles/mainStyles';

class ChatComponent extends React.Component { 
  state = {
    message: ''
  }

  tempStoreMessage = e => {
    const message = e.target.value;
    this.setState({message});
  }

  sendMessage = () => {
    const { storeSentMessages, chatInfo: { selectedUser, messages }, genInfo: { info: { uid } } } = this.props;
    const message = this.state.message;
    const messageObj = {message, recipient: selectedUser, sender: uid};
    if (message.length) {
      let newMessages = {...messages};
      if (newMessages[selectedUser]) newMessages[selectedUser].push(messageObj);
      else newMessages[selectedUser] = [messageObj];
      storeSentMessages(newMessages)
      socket.emit('sent-message', messageObj);
      this.setState({message:''});
    }
    else console.log('empty message')
  }
  render(){
    const { chatInfo: { selectedUser, messages, onlineUsers }, friendsInfo: { users }, genInfo: { info: { uid } } } = this.props;
    const enabledSend = (this.state.message).length; 
    
    const displayMessages = () => {
      return (
        <View style={styles.messagesSubContainer}>
          { 
            Object.keys(messages).map(key => {
              const usersMessages = messages[key]
              if (String(key) === String(selectedUser)) {
                return <View key={key} style={ styles.messagesSubContainer }>
                  {
                    Object.keys(usersMessages).map(key => {
                      const sender = usersMessages[key].sender;
                      const message = usersMessages[key].message;
                      if (String(sender) === String(selectedUser)) {
                        return (
                        <View key={key} style={styles.recievedContainer}>
                          <Text style={styles.recievedMsg}>{ message }</Text>
                        </View>
                        )
                      }
                      else if (String(sender) === String(uid)) {
                        return (
                        <View key={key} style={styles.sentContainer}>
                          <Text style={styles.sentMsg}>{ message }</Text>
                        </View>
                        )
                      }
                      else return;
                    })
                  }
                </View>
              }
            })
          }
        </View>
      )
    }

    return (
      <View style={styles.chatContainer}>
        <View style={styles.userInfoContainer}>
          {
            users.map(user => {
              if (user.uid === selectedUser ) return (
                <View key={user.uid} style={styles.userInfo}>
                  <img alt={ uid } style={styles.roundPic} src={user.avatar} />
                  <Text style={styles.userTextInfoContainer}>
                    <Text style={styles.username}>{ user.dname }</Text>
                    { onlineUsers[selectedUser] ?
                      <Text style={styles.availability}><FormattedMessage id="user.online" /></Text> :
                      <Text style={styles.availability}><FormattedMessage id="user.offline" /></Text>  
                    }
                  </Text>
                </View>
              )
            })
          }
        </View>
        <ScrollView 
          ref={ref => this.scrollView = ref}
          onContentSizeChange={() => {        
              this.scrollView.scrollToEnd({animated: true});
          }}
          style={styles.messagesContainer}
        >
          {displayMessages()}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput 
            value={this.state.message}
            onChange={this.tempStoreMessage}
            style={styles.input} 
            placeholder="type message..."
          />
          <TouchableOpacity disabled={!enabledSend} onPress={this.sendMessage} style={enabledSend ? styles.button : styles.disabledButton} >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity> 
        </View>
      </View>
    )
  }
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
      },
      storeSentMessages: message => {
          dispatch(dispatchSentMessage(message))
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatComponent);