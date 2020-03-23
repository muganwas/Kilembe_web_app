//import { StyleSheet } from 'react-native';

const styles = {
  chatContainer: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
  },
  input: {
    display: 'block',
    flex: 8,
    padding: 3,
    borderWidth: 1.5,
    borderColor: '#D4D4D4',
    borderRadius: 3,
    height: 30,
  },
  userInfoContainer: {
    position: 'relative',
    backgroundColor: '#EDEDED',
    zIndex: 1
  },
  members: {
    position: 'relative',
    width: '100%',
    height: 'auto',
  },
  roundPic: {
    width: 20,
    height: 20,
    margin: 3,
    borderWidth: 1,
    borderColor: '#c9c9c9',
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    borderRadius: '50%',
  },
  userInfo: {
    position: 'relative',
    boxSizing: 'border-box',
    display: 'block',
    margin: 5,
    zIndex: 1,
  },
  userTextInfoContainer: {
    margin: 3,
    position: 'relative',
    alignContent: 'center',
    alignItems: 'center',
    textAlignVertical:'top',
    display: 'inline-block',
  },
  closeButton: {
    margin: 3,
    float: 'right',
    position: 'relative',
    alignContent: 'center',
    alignItems: 'center',
    textAlignVertical:'top',
    display: 'inline-block',
    zIndex: 1,
  },
  closeButtonText: {
    textAlignVertical:'top',
    color: '#16B5F3',
  },
  username: {
    display: 'block',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 10,
    textTransform: 'capitalize'
  },
  availability: {
    display: 'block',
    textAlign: 'left',
    fontSize: 8,
    fontWeight: 'thin',
    textTransform: 'capitalize'
  },
  recievedContainer: {
    display: 'block',
    textAlign: 'left',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  recievedMsg: {
    margin: 3,
    padding: 3,
    borderRadius: 3,
    display: 'inline-block',
    alignItems: 'flex-start',
    color: "#000",
    textAlign: 'left',
    backgroundColor: "#16B5F3"
  },
  sentContainer: {
    flex: 1,
    display: 'block',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  sentMsg: {
    margin: 3,
    padding: 3,
    borderRadius: 3,
    display: 'inline-block',
    alignItems: 'flex-end',
    textAlign: 'right',
    color: "#000",
    backgroundColor: "#16B5F3"
  },
  messagesContainer: {
    display: 'block',
    height: '100%',
    minHeight: 100,
    padding: 10,
    height: 200
  },
  messagesSubContainer: {
    display: 'block'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: 10,
    height: 30,
    minWidth: 50,
    backgroundColor: '#16B5F2'
  },
  disabledButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: 10,
    height: 30,
    minWidth: 50,
    backgroundColor: '#7F8787'
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff'
  },
  friendActive: {
    boxSizing: 'border-box',
    backgroundColor: '#EDEDED',
    padding: 5,
    display: 'block',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
    zIndex: 0
  },
  friend: {
    boxSizing: 'border-box',
    padding: 5,
    display: 'block',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
    zIndex: 0
  },
  leftCol: {
    position: 'relative',
    display: 'table'
  },
  avatarContainer: {
    display: 'table-cell',
    verticalAlign: 'middle',
    width: 30,
    height: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#c9c9c9',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '50%'
  },
  avatar: {
    position: 'relative',
    width: 30,
    height: 30
  },
  userOnline: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '50%',
    backgroundColor: '#0ed43f',
    width: 8,
    height: 8,
    zIndex: 1000
  },
  userOffline: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '50%',
    backgroundColor: '#a5a5a5',
    width: 8,
    height: 8,
    zIndex: 1000
  },
  name: {
    textTransform: 'capitalize',
    display: 'table-cell',
    alignItems: 'center',
    textAlignVertical: 'middle',
    alignContent: 'center',
    padding: 5,
    fontSize: 10,
    fontWeight: 'bold'
  },
  messages: {
    backgroundColor: '#b9b9b9',
    padding: 3,
    textTransform: 'lowercase',
    fontStyle: 'italic',
    color: '#f0f0f0'
  },
  conversationContainer: {
    position: 'relative',
    padding: 10,
    display: 'block',
    flex: 7,
    zIndex: 1
  },
  messagingCallToAction: {
    display: 'block',
    color: '#bbbbbb',
    textAlign: 'center'
  }
};

export default styles;