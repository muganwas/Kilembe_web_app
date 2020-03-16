import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  profile: {
    display: 'table'
  },
  uploadFeedback: {
    position: 'absolute',
    backgroundColor: '#fff',
    color: '#3b5998',
    display: 'block',
    top: 0,
    left: 10,
    fontSize: 13,
    padding: 5,
    fontWeight: 'bold',
    zIndex: 1000
  },
  avatarUploaderContainer: {
    display: 'table-cell',
    width: 30,
    padding: 10,
    cursor: 'pointer',
  },
  avatarContainer: {
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
  welcome: {
    display: 'table-cell',
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    textAlignVertical: 'middle',
    marginTop: '14%',
    marginBottom: '14%',
    marginLeft: 0,
    marginRight: 0
  }
})

export default styles;