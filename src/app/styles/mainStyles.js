import { StyleSheet } from 'react-native';
import { isMobile } from '../misc/helpers';

const width = window.innerWidth;

const mainStyles = StyleSheet.create({
  authContainer: {
    boxSizing: 'border-box',
    display: 'inline-block',
    backgroundColor: '#f0f0f0',
    marginTop: '10%',
    marginBottom: '10%',
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 50,
    paddingRight: 0,
    paddingBottom: 50,
    paddingLeft: 0,
    borderRadius: 5,
    width: isMobile(width) ? '98%' : 350
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginRight: 50,
    marginBottom: 20,
    marginLeft: 50
  },
  logo: {
    width: 120,
    height: 50,
    zIndex: 1000
  },
  feedBack: {
    fontSize: 13,
    color: '#ece3e2',
    backgroundColor: '#494141',
    marginTop: 2,
    marginBottom: 5,
    display: 'block',
    padding: 3,
    borderRadius: 1
  },
  form: {
    marginTop: 0,
    marginBottom: 0,
    marginRight: 50,
    marginLeft: 50
  },
  alternatives: {
    paddingTop: 5,
    paddingBottom: 5
  },
  titleMedium: {
    display: 'block',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold'
  },
  mainNavigation: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    color: '#fff',
    backgroundColor: '#494141',
    paddingTop: 5,
    paddindBottom: 5,
    paddingLeft: 20,
    paddingRight: 20
  },
  nav: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
    position: 'absolute',
    top:20,
    right: 0,
    zIndex: 10000
  },
  mainContainer: {
    boxSizing: 'border-box',
    display: 'inline-block',
    overflowX: 'hidden',
    position: 'relative',
    width: '70%',
    textAlign: 'left'
  },
  mainContainerTab: {
    boxSizing: 'border-box',
    display: 'inline-block',
    overflowX: 'hidden',
    position: 'relative',
    width: '90%',
    textAlign: 'left'
  },
  mainContainerMobi: {
    boxSizing: 'border-box',
    display: 'inline-block',
    overflowX: 'hidden',
    position: 'relative',
    width: '100%',
    textAlign: 'left'
  },
  authSubmitButton: {
    display: 'flex',
    padding: 3,
    marginTop: 2,
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 3,
    boxShadow: "1px 2px 3px rgba(127,125,135, 0.8)"
  },
  authSubmitButtonOffline: {
    display: 'flex',
    padding: 3,
    marginTop: 2,
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 3,
    boxShadow: "1px 1px 1px rgba(127,125,135, 0.4)"
  },
  authOfflineBannerContainer: {
    position: 'absolute',
    backgroundColor: "#000",
    display: 'table',
    width: '100%',
    height: 40,
    top: 0,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
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
  messaging: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    boxSizing: 'border-box',
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.1)",
    zIndex: 1
  },
  title: {
    display: 'block',
    marginTop: 10,
    marginBottom: 10,
    color: '#43423c',
    fontWeight: 'bold'
  },
  friendsList: {
    minWidth: 200,
    flex: 2,
    boxSizing: 'border-box',
    width: '25%',
    padding: 10,
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.15)'
  },
  friendsListTab: {
    minWidth: 160,
    flex: 2,
    boxSizing: 'border-box',
    width: '35%',
    padding: 5,
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.15)'
  },
  friendsListMobi: {
    minWidth: 80,
    flex: 2,
    boxSizing: 'border-box',
    width: '25%',
    padding: 5,
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.15)'
  }
});

export default mainStyles;