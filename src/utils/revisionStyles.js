import { StyleSheet } from 'react-native';
import colors from '../utils/colors';

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
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  landscapeContainer: {
    flexDirection: 'column', // Cambié a columna para que cada fila sea independiente
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  row: {
    flexDirection: 'row', // Asegura que cada fila tendrá dos columnas (si existe par de artículos)
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  columnLeft: {
    flex: 1,
    marginRight: 10, // Añado un pequeño margen entre columnas
  },
  columnRight: {
    flex: 1,
    marginLeft: 10, // Añado un pequeño margen entre columnas
  },
  centeredRow: {
    flexDirection: 'column', // Cambié a columna para que el nombre esté arriba y los botones debajo
    justifyContent: 'center', // Centra el artículo neutro en su fila
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%', // Para asegurar que los botones estén alineados correctamente
  },
  buttonHalfWidth: {
    flex: 0.5, // Esto hace que los botones ocupen la mitad del ancho disponible
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginHorizontal: 5,
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
  buttonHalfWidth: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginHorizontal: 5,
    width: '50%',
  },
  itemName: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10, // Ajustado para dar más espacio entre el nombre y los botones
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
    backgroundColor: colors.primary,
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
