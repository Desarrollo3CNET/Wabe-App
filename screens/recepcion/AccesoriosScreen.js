import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleAccesorio,
  toggleInfo,
  updateAccesorio,
} from '../../src/contexts/BoletaSlice';
import {
  resetBoleta,
  setCreatingBoletaFalse,
} from '../../src/contexts/AppSlice';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import GenericModal from '../../src/components/recepcion/GenericModal';
import { createBoleta } from '../../src/services/BoletaService';
import { saveImages } from '../../src/services/FotografiasService';

const AccesoriosScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const boleta = useSelector((state) => state.boleta);
  const accesorios = boleta.ACC_ACCESORIOS;

  const [modalVisibleBoleta, setmodalVisibleBoleta] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta'); // Por defecto es "CancelBoleta"
  const [modalMessage, setModalMessage] = useState(''); // Para el mensaje dinámico en el modal

  const handleToggleInfo = (id) => {
    dispatch(toggleInfo(id));
  };

  const handleToggleAccesorio = (id) => {
    dispatch(toggleAccesorio(id));
  };

  const handleUpdate = (id, key, value) => {
    dispatch(updateAccesorio({ id, updates: { [key]: value } }));
  };

  const handleNext = async () => {
    try {
      setCaseType('Notificacion');

      const {
        CITCLIE_CODE,
        LIST_IMAGES,
        paths,
        undonePaths,
        fechaIngreso,
        horaIngreso,
        ...boletaFiltrada
      } = boleta;

      // Prepara el objeto listaFotos con la estructura requerida
      const listaFotos = {
        Fecha: new Date().toISOString(), // Fecha de hoy en formato ISO 8601
        Placa: boleta.BOL_VEH_PLACA, // Placa desde la boleta
        TipoTrabajo: 'Reparación', // Valor fijo
        Imagenes: boleta.LIST_IMAGES, // Imágenes de la boleta
      };

      // Llama a saveImages y guarda el resultado
      const saveImagesResponse = await saveImages(listaFotos);

      // Verifica si hubo algún problema con saveImages
      if (!saveImagesResponse || saveImagesResponse.error) {
        setModalMessage(
          'Ocurrió un problema al guardar las imágenes. Por favor, inténtalo de nuevo.',
        );
        setmodalVisibleBoleta(true);
        return; // Detener la ejecución si hubo un error con saveImages
      }

      // Si saveImages fue exitoso, continúa con createBoleta
      const respuesta = await createBoleta(boletaFiltrada, boleta.CITCLIE_CODE);

      if (respuesta) {
        dispatch(resetBoleta());
        dispatch(setCreatingBoletaFalse());
        setModalMessage('Se ha finalizado la boleta correctamente.');
        navigation.navigate('CheckOutScreen');
      } else {
        setModalMessage(
          'Hubo un problema al finalizar la boleta. Por favor, inténtalo de nuevo.',
        );
      }
    } catch (error) {
      setModalMessage(
        'Ocurrió un problema al procesar la solicitud. Por favor, verifica tu conexión e inténtalo de nuevo.',
      );
      console.error('Error en handleNext:', error);
    } finally {
      setmodalVisibleBoleta(true);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción" />

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {accesorios.map((accesorio) => (
            <View key={accesorio.TIPACC_CODE} style={styles.rowContainer}>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[
                    styles.switchContainer,
                    accesorio.habilitado ? styles.switchOn : styles.switchOff,
                  ]}
                  onPress={() => handleToggleAccesorio(accesorio.TIPACC_CODE)}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      accesorio.habilitado ? styles.thumbOn : styles.thumbOff,
                    ]}
                  />
                </TouchableOpacity>
                <Text style={styles.accesorioName}>
                  {accesorio.TIPACC_NOMBRE}
                </Text>
                {accesorio.habilitado && (
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => handleToggleInfo(accesorio.TIPACC_CODE)}
                  >
                    <Text style={styles.infoButtonText}>Información</Text>
                  </TouchableOpacity>
                )}
              </View>

              {accesorio.infoVisible && (
                <View style={styles.infoContainer}>
                  {accesorio.TIPACC_SETESTADO !== undefined && (
                    <View style={styles.infoField}>
                      <Text style={styles.infoLabel}>Estado</Text>
                      <Picker
                        selectedValue={accesorio.TIPACC_SETESTADO}
                        onValueChange={(value) =>
                          handleUpdate(
                            accesorio.TIPACC_CODE,
                            'TIPACC_SETESTADO',
                            value,
                          )
                        }
                        style={styles.picker}
                      >
                        <Picker.Item label="Bueno" value="Bueno" />
                        <Picker.Item label="Regular" value="Regular" />
                        <Picker.Item label="Malo" value="Malo" />
                      </Picker>
                    </View>
                  )}

                  {accesorio.TIPACC_SETMARCA !== undefined && (
                    <View style={styles.infoField}>
                      <Text style={styles.infoLabel}>Marca</Text>
                      <TextInput
                        style={styles.newInput}
                        value={accesorio.TIPACC_SETMARCA}
                        onChangeText={(value) =>
                          handleUpdate(
                            accesorio.TIPACC_CODE,
                            'TIPACC_SETMARCA',
                            value,
                          )
                        }
                      />
                    </View>
                  )}

                  {accesorio.TIPACC_SETDESCRIPCION !== undefined && (
                    <View style={styles.infoField}>
                      <Text style={styles.infoLabel}>Descripción</Text>
                      <TextInput
                        style={styles.newInput}
                        value={accesorio.TIPACC_SETDESCRIPCION}
                        onChangeText={(value) =>
                          handleUpdate(
                            accesorio.TIPACC_CODE,
                            'TIPACC_SETDESCRIPCION',
                            value,
                          )
                        }
                      />
                    </View>
                  )}

                  {accesorio.TIPACC_SETCANTIDAD !== undefined && (
                    <View style={styles.infoField}>
                      <Text style={styles.infoLabel}>Cantidad</Text>
                      <TextInput
                        style={styles.newInput}
                        value={String(accesorio.TIPACC_SETCANTIDAD)}
                        keyboardType="numeric"
                        onChangeText={(value) =>
                          handleUpdate(
                            accesorio.TIPACC_CODE,
                            'TIPACC_SETCANTIDAD',
                            Number(value),
                          )
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
        onDelete={() => {
          setCaseType('CancelBoleta'); // Cambiar a caso CancelBoleta
          setmodalVisibleBoleta(true);
        }}
        onNext={handleNext}
      />

      <GenericModal
        visible={modalVisibleBoleta}
        onClose={() => setmodalVisibleBoleta(false)}
        navigation={navigation}
        caseType={caseType} // Se ajusta dinámicamente según el contexto
        message={modalMessage} // Mensaje dinámico
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
