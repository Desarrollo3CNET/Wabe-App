import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleAccesorio,
  toggleInfo,
  updateAccesorio,
} from '../../src/contexts/store';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import CancelBoletaModal from '../../src/components/recepcion/CancelBoletaModal';

const AccesoriosScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const accesorios = useSelector((state) => state.accesorios);
  const [modalVisibleBoleta, setmodalVisibleBoleta] = useState(false);

  const handleToggleInfo = (id) => {
    dispatch(toggleInfo(id));
  };

  const handleToggleAccesorio = (id) => {
    dispatch(toggleAccesorio(id));
  };

  const handleUpdate = (id, key, value) => {
    dispatch(updateAccesorio({ id, updates: { [key]: value } }));
  };

  const handleNext = () => {
    Alert.alert(
      'Boleta completada',
      'Se ha finalizado la boleta correctamente.',
    );
    navigation.navigate('CheckOutScreen');
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción - Accesorios" />

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {accesorios.map((accesorio) => (
            <View key={accesorio.id} style={styles.rowContainer}>
              <View style={styles.row}>
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
                <Text style={styles.accesorioName}>{accesorio.nombre}</Text>
                {accesorio.habilitado && (
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => handleToggleInfo(accesorio.id)}
                  >
                    <Text style={styles.infoButtonText}>Información</Text>
                  </TouchableOpacity>
                )}
              </View>

              {accesorio.infoVisible && (
                <View style={styles.infoContainer}>
                  {/* Estado */}
                  <View style={styles.infoField}>
                    <Text style={styles.infoLabel}>Estado</Text>
                    <Picker
                      selectedValue={accesorio.estado}
                      onValueChange={(value) =>
                        handleUpdate(accesorio.id, 'estado', value)
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="Bueno" value="Bueno" />
                      <Picker.Item label="Regular" value="Regular" />
                      <Picker.Item label="Malo" value="Malo" />
                    </Picker>
                  </View>

                  {/* Marca */}
                  {accesorio.marca && (
                    <View style={styles.infoField}>
                      <Text style={styles.infoLabel}>Marca</Text>
                      <TextInput
                        style={styles.newInput}
                        value={accesorio.marca}
                        onChangeText={(value) =>
                          handleUpdate(accesorio.id, 'marca', value)
                        }
                      />
                    </View>
                  )}

                  {/* Descripcion */}
                  {accesorio.descripcion && (
                    <View style={styles.infoField}>
                      <Text style={styles.infoLabel}>Descripción</Text>
                      <TextInput
                        style={styles.newInput}
                        value={accesorio.descripcion}
                        onChangeText={(value) =>
                          handleUpdate(accesorio.id, 'descripcion', value)
                        }
                      />
                    </View>
                  )}

                  {/* Cantidad */}
                  {accesorio.cantidad !== undefined && (
                    <View style={styles.infoField}>
                      <Text style={styles.infoLabel}>Cantidad</Text>
                      <TextInput
                        style={styles.newInput}
                        value={String(accesorio.cantidad)}
                        keyboardType="numeric"
                        onChangeText={(value) =>
                          handleUpdate(accesorio.id, 'cantidad', Number(value))
                        }
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      <FooterButtons
        onBack={() =>
          navigation.navigate('PhotosAndVideosScreen', {
            fromScreen: 'AccesoriosScreen',
          })
        }
        onDelete={() => setmodalVisibleBoleta(true)}
        onNext={handleNext}
      />

      <CancelBoletaModal
        visible={modalVisibleBoleta}
        onClose={() => setmodalVisibleBoleta(false)}
        navigation={navigation}
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
  rowContainer: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  switchContainer: {
    width: 40,
    height: 20,
    borderRadius: 20,
    justifyContent: 'center',
    padding: 2,
  },
  switchOn: {
    backgroundColor: '#FFD700',
  },
  switchOff: {
    backgroundColor: '#E0E0E0',
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  thumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: '#000',
  },
  thumbOff: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
  },
  accesorioName: {
    flex: 2,
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButtonText: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  infoContainer: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
  },
  infoField: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#000',
  },
  picker: {
    height: 40,
    color: '#333',
  },
  // Styles for new inputs
  newInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
  },
});

export default AccesoriosScreen;
