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
    height: 50,
  },
  userInfo: {
    flex: 1
  },
  userName: {
    textTransform: 'capitalize'
  },
  messages: {
    flex: 2,
    minHeight: 50
  },
  inputContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: 10,
    backgroundColor: '#16B5F2'
  },
  buttonText: {
    alignText: 'center',
    color: '#fff'
  }
});

export default styles;