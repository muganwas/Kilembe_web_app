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
    backgroundColor: '#EDEDED',
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
    boxSizing: 'border-box',
    display: 'block',
    margin: 5
  },
  userTextInfoContainer: {
    margin: 3,
    position: 'relative',
    alignContent: 'center',
    alignItems: 'center',
    textAlignVertical:'top',
    display: 'inline-block',
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