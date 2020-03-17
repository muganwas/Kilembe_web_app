import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainNavigation: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    color: '#fff',
    backgroundColor: '#494141',
    paddingTop: 5,
    paddindBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    zIndex: 1000
  },
  mainNavigationMobile: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    color: '#fff',
    backgroundColor: '#494141',
    paddingTop: 5,
    paddindBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    zIndex: 1000
  },
  nav: {
    display: 'table-cell',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
    position: 'absolute',
    top:'25%',
    right: 0
  },
  dropdownContainer: {
    position: 'absolute',
    top: 30,
    right: 1,
    zIndex: 1000,
    textAlign: 'center',
    alignItems: 'center'
  },
  dropdown: {
    display: 'block',
    backgroundColor: '#fff',
    borderRadius: 1,
    boxShadow: "1px 2px 3px rgba(127,125,135, 0.8)",
  },
  dropdownItem: {
    display: 'block'
  },
  dropdownMenuButtons: {
    display: 'block',
    cursor: 'pointer',
    padding: 1,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 0,
    marginRight: 0
  },
  dropdownMenuButtonsHovered: {
    display: 'block',
    backgroundColor: '#EDEDED',
    cursor: 'pointer',
    padding: 1,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 0,
    marginRight: 0
  },
  dropdownMenuTextStyle: {
    display: 'table-cell',
    textAlignVertical: 'middle',
    fontSize: 12,
    padding: 3,
  },
  dropdownMenuBackgroundImage: {
    display: 'inline-block',
    marginLeft: 5,
    width: 7,
    height: 7
  },
  dropdownMenuSplitter: {
    width: '100%',
    backgroundColor: '#EDEDED',
    height: 1
  },
  navButtonStyle: {
    display: 'inline-block',
    cursor: 'pointer',
    float: 'left',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 0,
    marginRight: 0
  },
  navButtonHoveredStyle: {
    display: 'inline-block',
    cursor: 'pointer',
    backgroundColor: '#FDD906',
    float: 'left',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 0,
    marginRight: 0
  },
  alert: {
    position: 'absolute',
    top: 6,
    left: 13,
    backgroundColor: '#fdd806',
    height: 8,
    width: 8,
    borderRadius: '45%',
    zIndex: 1000,
  }
});

export default styles;