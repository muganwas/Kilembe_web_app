import { StyleSheet } from 'react-native';

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
    width: 350
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
  }
});

export default mainStyles;