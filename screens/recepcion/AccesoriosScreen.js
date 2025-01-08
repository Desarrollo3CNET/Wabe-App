import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleAccesorio,
  toggleInfo,
  updateAccesorio,
} from '../../src/contexts/store'; // Asegúrate de importar correctamente tus acciones
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';

const AccesoriosScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const accesorios = useSelector((state) => state.accesorios); // Obtener accesorios desde Redux

  const handleToggleInfo = (id) => {
    dispatch(toggleInfo(id));
  };

  const handleToggleAccesorio = (id) => {
    dispatch(toggleAccesorio(id));
  };

  const handleUpdate = (id, estado) => {
    dispatch(updateAccesorio({ id, updates: { estado } }));
  };

  const handleNext = () => {
    Alert.alert(
      'Boleta completada',
      'Se ha finalizado la revisión correctamente.',
    );
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción - Accesorios" />

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchInput}>Buscar un accesorio</Text>
          </View>

          {accesorios.map((accesorio) => (
            <View key={accesorio.id} style={styles.rowContainer}>
              <View style={styles.row}>
                {/* Switch */}
                <TouchableOpacity
                  style={[
                    styles.switchContainer,
                    accesorio.habilitado ? styles.switchOn : styles.switchOff,
                  ]}
                  onPress={() => handleToggleAccesorio(accesorio.id)}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      accesorio.habilitado ? styles.thumbOn : styles.thumbOff,
                    ]}
                  />
                </TouchableOpacity>

                {/* Nombre del accesorio */}
                <Text style={styles.accesorioName}>{accesorio.nombre}</Text>

                {/* Botón Información */}
                {accesorio.habilitado && (
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => handleToggleInfo(accesorio.id)}
                  >
                    <Text style={styles.infoButtonText}>Información</Text>
                    <View style={styles.infoIcon}>
                      <Text style={styles.iconText}>
                        {accesorio.infoVisible ? '-' : '+'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {/* Acordeón para información */}
              {accesorio.infoVisible && (
                <View style={styles.infoContainer}>
                  <View style={styles.infoField}>
                    <Text style={styles.infoLabel}>Estado del accesorio</Text>
                    <View style={styles.selectorContainer}>
                      <Picker
                        selectedValue={accesorio.estado}
                        onValueChange={(value) =>
                          handleUpdate(accesorio.id, value)
                        }
                        style={styles.picker}
                      >
                        <Picker.Item label="Bueno" value="Bueno" />
                        <Picker.Item label="Regular" value="Regular" />
                        <Picker.Item label="Malo" value="Malo" />
                      </Picker>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      <FooterButtons
        onBack={() => navigation.navigate('VehicleDetailsScreen')}
        onDelete={() => console.log('Eliminar Boleta')}
        onNext={handleNext}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },
  scrollContent: {
    flexGrow: 1,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
    color: '#000',
  },
  rowContainer: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  // SWITCH
  switchContainer: {
    width: 40,
    height: 20,
    borderRadius: 20, // Redondeado completo
    justifyContent: 'center',
    padding: 2,
    backgroundColor: '#000', // Fondo negro
  },
  switchOn: {
    backgroundColor: '#000', // Fondo negro permanece igual
  },
  switchOff: {
    backgroundColor: '#E0E0E0', // Fondo negro para apagado también
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFD700', // Amarillo
  },
  thumbOn: {
    alignSelf: 'flex-end', // Desplazado a la derecha
  },
  thumbOff: {
    alignSelf: 'flex-start', // Desplazado a la izquierda
  },
  accesorioName: {
    flex: 2,
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  // BOTÓN DE INFORMACIÓN
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButtonText: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
    fontWeight: 'bold', // Negrita para el texto
  },
  infoIcon: {
    width: 24, // Tamaño más grande
    height: 24,
    borderRadius: 12, // Ícono completamente redondo
    backgroundColor: '#FFD700', // Amarillo
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
    color: '#000', // Negro
    fontWeight: 'bold', // Negrita para el símbolo
  },
  // SELECTOR DE ESTADO
  infoContainer: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
  },
  infoField: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  selectorContainer: {
    backgroundColor: '#FFF', // Fondo blanco
    paddingHorizontal: 5,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    color: '#333', // Texto gris oscuro
  },
});

export default AccesoriosScreen;
