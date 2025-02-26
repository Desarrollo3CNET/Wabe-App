import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    paddingTop: 10,
  },
  cameraButtonFloating: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  landscapeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondItem: {
    marginLeft: '4%',
  },
  portraitContainer: {
    flexDirection: 'column',
  },
  portraitRow: {
    width: '100%',
    padding: 10,
  },
  landscapeItem: {
    width: '48%',
    marginVertical: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
    marginHorizontal: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  itemName: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: '#FFD700',
  },
  statusText: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  noItemsText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
  },
});

export default styles;
