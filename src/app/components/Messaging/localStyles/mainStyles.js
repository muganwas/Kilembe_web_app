import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  chatContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
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
  },
  members: {
    position: 'relative',
    width: '100%',
    height: 'auto',
  },
  roundPic: {
    width: 20,
    maxHeight: 23,
    minHeight: 20,
    margin: 3,
    borderWidth: 1,
    borderColor: '#c9c9c9',
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    borderRadius: '50%',
  },
  userInfo: {
    boxSizing: 'border-box',
    alignContent: 'center',
    alignItems: 'center',
    display: 'block',
    height: 40
  },
  userName: {
    margin: 2,
    alignContent: 'center',
    alignItems: 'center',
    padding: 5,
    display: 'inline-block',
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
    backgroundColor: '#16B5F2'
  },
  disabledButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: 10,
    height: 30,
    backgroundColor: '#7F8787'
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff'
  }
});

export default styles;