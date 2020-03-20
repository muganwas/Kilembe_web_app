import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: "#000",
    display: 'table',
    width: '100%',
    height: 40,
    top: 0,
    borderRadius: 3
  },
  containerOnline: {
    display: 'none',
    opacity: 0
  },
  infoText: {
    display: 'table-cell',
    fontWeight: 'bold',
    textAlignVertical: 'center',
    color: '#fff',
    textAlign: 'center'
  }
});

export default styles;