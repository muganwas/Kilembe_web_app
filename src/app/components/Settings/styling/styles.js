//import { StyleSheet } from 'react-native';

const styles = {
  toggleOn: {
    textAlignVertical:'middle',
    color: '#16B5F3',
    paddingRight: 3
  },
  oggleOff: {
    textAlignVertical:'middle',
    color: '#7F8787',
    paddingRight: 3
  },
  iconContainer: {
    width: 125,
    display: 'flex',
    flexDirection: 'row',
    margin: 3,
    padding: 2,
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 3,
    boxShadow: "1px 2px 3px rgba(127,125,135, 0.8)",
    position: 'relative',
    alignContent: 'center',
    alignItems: 'center',
    verticalAlign: 'middle',
    textAlignVertical:'middle',
    zIndex: 1,
  },
  subTitle: {
    fontWight: 'bolder',
    textAlignVertical:'middle',
    fontSize: 12,
  },
  inputContainer: {

  },
  inputLabel: {
    fontWeight: 500,
    padding: 2
  },
  input: {
    borderWidth: 1,
    fontSize: 14,
    padding: 5,
    borderColor: '#EDEDED'
  },
  checkBoxContainer: {
    display: 'table'
  },
  shareCheckBox: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  shareEmailDescription: {
    display: 'table-cell',
    textAlignVertical: 'middle',
    paddingLeft: 5,
    fontSize: 11
  }
};

export default styles;