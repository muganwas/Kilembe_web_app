//import { StyleSheet } from 'react-native';

const styles = {
  content: {
    fontSize: '13',
    backgroundColor: '#ffffff',
    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.15)",
    paddingTop: 5,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
    margin: 2
  },
  contentMobi: {
    fontSize: '13',
    backgroundColor: '#ffffff',
    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.15)",
    padding: 5,
    margin: 2
  },
  header: {
    display: 'block',
    marginTop: 10,
    marginBottom: 10,
    color: '#43423c',
    fontWeight: 'bold'
  },
  subContainer: {
    display: 'block',
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center'
  },
  userInfoContainer: {
    textAlign: 'left',
    boxSizing: 'border-box',
    overflow: 'hidden',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.15)',
    borderRadius: 2,
    position: 'relative',
    display: 'inline-block',
    minHeight: 40,
    maxHeight: 45,
    margin: 5,
    padding: 5,
    cursor: 'pointer'
  },
  roundPic: {
    width: 30,
    height: 30,
    margin: 3,
    borderWidth: 1,
    borderColor: '#c9c9c9',
    position: 'relative',
    display: 'table-cell',
    verticalAlign: 'middle',
    overflow: 'hidden',
    borderRadius: '50%',
  },
  userInfo: {
    display: 'table'
  },
  userTextInfoContainer: {
    margin: 3,
    position: 'relative',
    alignContent: 'center',
    alignItems: 'center',
    textAlignVertical:'middle',
    display: 'table-cell',
  },
  username: {
    display: 'block',
    color: '#43423c',
    fontWeight: 'bolder',
    textAlign: 'left',
    fontSize: 12,
    padding: 3,
    textTransform: 'capitalize'
  },
  notificationIcon: {
    margin: 3,
    position: 'absolute',
    display: 'block',
    color: '#FDD906',
    top: -10,
    right: -8
  },
};

export default styles;