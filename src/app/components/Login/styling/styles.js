import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  divider: {
    display: 'block',
    height: 5,
    backgroundColor: '#fff'
  },
  submitButton: {
    display: 'flex',
    width: 250,
    padding: 3,
    marginTop: 2,
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 3,
    boxShadow: "1px 2px 3px rgba(127,125,135, 0.8)"
  },
  submitButtonOffline: {
    display: 'flex',
    width: 250,
    padding: 3,
    marginTop: 2,
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 3,
    boxShadow: "1px 1px 1px rgba(127,125,135, 0.4)"
  },
  facebookAuth: {
    boxSizing: 'border-box',
    backgroundColor: '#4267B2',
    borderRadius: 3,
    boxShadow: "1px 2px 3px rgba(127,125,135, 0.8)",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 2
  },
  facebookAuthOffline: {
    boxSizing: 'border-box',
    backgroundColor: '#4267B2',
    borderRadius: 3,
    boxShadow: "1px 1px 1px rgba(127,125,135, 0.4)",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 2
  },
  facebookAuthText: {
    color: '#fff',
    display: 'table-cell',
    textAlign: 'center',
    textAlignVertical: 'middle'
  },
  googleAuth: {
    boxSizing: 'border-box',
    backgroundColor: '#FF0000',
    borderRadius: 3,
    boxShadow: "1px 2px 3px rgba(127,125,135, 0.8)",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 2,
  },
  googleAuthOffline: {
    boxSizing: 'border-box',
    backgroundColor: '#FF0000',
    borderRadius: 3,
    boxShadow: "1px 1px 1px rgba(127,125,135, 0.4)",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 2,
  },
  googleAuthText: {
    color: '#fff',
    display: 'table-cell',
    textAlign: 'center',
    textAlignVertical: 'middle'
  },
  submitButtonText: {
    flex: 1,
    textAlign: 'center',
  },
  textInput: {
    marginBottom: 3,
    borderWidth: 0,
    boxShadow: "1px 2px 3px rgba(127,125,135, 0.3)",
    padding: 4,
    backgroundColor: '#fff'
  },
  resetSessionButtonContainer: {
    display: 'inline-block',
    width: '100%',
    cursor: 'pointer',
    padding: 3,
    backgroundColor: '#fff',
    borderRadius: 1,
    boxShadow: "1px 1px 3px rgba(255,255,255, 0.3)",
    textAlignVertical: 'middle',
    textAlign: 'center',
    marginTop: 3,
    marginLeft: 0,
    marginRight: 0
  },
  resetSessionButtonContainerOnHover: {
    display: 'inline-block',
    width: '100%',
    cursor: 'pointer',
    padding: 3,
    backgroundColor: '#EDEDED',
    borderRadius: 1,
    boxShadow: "1px 1px 3px rgba(255,255,255, 0.3)",
    textAlignVertical: 'middle',
    textAlign: 'center',
    marginTop: 3,
    marginLeft: 0,
    marginRight: 0
  },
  resetSessionText: {
    textAlignVertical: 'middle',
    verticalAlign: 'middle',
    color: '#7F8787',
  }
});

export default styles;