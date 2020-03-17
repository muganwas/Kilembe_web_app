import { StyleSheet } from 'react-native';
import { isMobile } from 'misc/helpers';

const styles = StyleSheet.create({
  tutorialContainer: {
    display: 'flex',
    flexDirection: isMobile() ? 'column' : 'row'
  },
  tutorialContainerMobi: {
    display: 'flex',
    flexDirection: 'column'
  },
  courseListContainer: {
    flex: 3,
  },
  courseList: {
    padding: 5,
    height: 'auto',
    boxShadow: "0 0.5px 0 0 #ffffff inset, 0 1px 2px 0 #B3B3B3"
  },
  tutorial: {
    flex: 5,
    overflow: 'hidden',
    paddingTop: 5,
    paddingLeft: 5,
    paddingBottom: 20,
    paddingRight: 5,
    margin: 0,
    height: 315,
    boxShadow: "0 0.5px 0 0 #ffffff inset, 0 1px 2px 0 #B3B3B3"
  },
  playlistContainer: {
    flex: 2
  },
  playlist: {
    height: 'auto',
    boxSizing: 'border-box',
    boxShadow: '0 0.5px 0 0 #ffffff inset, 0 1px 2px 0 #B3B3B3',
    padding: 5
  },
  header: {
    display: 'block',
    width: '50%',
    float: 'left',
    color: '#43423c',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  item: {
    clear: 'both',
    width: '100%',
    display: 'table',
    position: 'relative',
    backgroundColor: '#000',
    color: '#fff',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#fff'
  },
  course: {
    display: 'block',
    padding: 2,
    paddingLeft: 5,
    margin: 1,
    backgroundColor: '#fdd806',
    borderWidth: 1,
    borderColor: '#bec1c6',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  courseListText: {
    color: '#43423c',
    fontWeight: 'bold',
  },
  closeButtonStyle: {
    cursor: 'pointer',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 2,
    paddingRight: 2
  },
  uVideo: {
    boxSizing: 'content-box',
    width: '100%',
    height: '100%'
  },
  text: {
    display: 'table-cell',
    textVerticleAlign: 'middle',
    color: '#fff',
    float: 'left',
    padding: 2,
    width: '85%'
  },
  clear: {
    clear: 'both',
    content: ' '
  }
});

export default styles;