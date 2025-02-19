import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleAccesorio,
  toggleInfo,
  updateAccesorio,
} from '../../src/contexts/BoletaSlice';
import { setCreatingBoletaFalse } from '../../src/contexts/AppSlice';
import { resetBoleta, resetAccesorios } from '../../src/contexts/BoletaSlice';

import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import GenericModal from '../../src/components/recepcion/GenericModal';
import { createBoleta } from '../../src/services/BoletaService';
import { saveImages } from '../../src/services/FotografiasService';
import convertSignatureToBase64 from '../../src/utils/convertSignatureToBase64';
import generateImageWithPathsInBase64 from '../../src/utils/generateImageWithPathsInBase64';

const AccesoriosScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const boleta = useSelector((state) => state.boleta);
  const empresa = useSelector((state) => state.app.empresa);
  const user = useSelector((state) => state.app.user); // Estado global del usuario
  const accesorios = boleta.ACC_ACCESORIOS;

  const [modalVisibleBoleta, setmodalVisibleBoleta] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta'); // Por defecto es "CancelBoleta"
  const [modalMessage, setModalMessage] = useState(''); // Para el mensaje dinámico en el modal
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el spinner

  const handleToggleInfo = (id) => {
    dispatch(toggleInfo(id));
  };

  const handleToggleAccesorio = (id) => {
    dispatch(toggleAccesorio(id));
  };

  const handleUpdate = (TIPACC_CODE, key, value) => {
    dispatch(updateAccesorio({ TIPACC_CODE, updates: { [key]: value } }));
  };

  const handleNext = async () => {
    try {
      setCaseType('Notificacion');

      setIsLoading(true);

      let tipoTrabajo = '';
      switch (boleta.TIPTRA_CODE) {
        case 1:
          tipoTrabajo = 'Avalúo';
          break;
        case 2:
          tipoTrabajo = 'Reparación';
          break;
        case 3:
          tipoTrabajo = 'Rep. Pendientes';
          break;
        case 4:
          tipoTrabajo = 'Aseguradora';
          break;
        default:
          tipoTrabajo = 'Desconocido';
          break;
      }

      const imagenesBase64 = boleta.LIST_IMAGES.map((image) => image.base64);

      //Prepara el objeto listaFotos con la estructura
      const listaFotos = {
        Fecha: new Date().toISOString(), // Fecha de hoy en formato ISO 8601
        Placa: boleta.BOL_VEH_PLACA, // Placa desde la boleta
        TipoTrabajo: tipoTrabajo,
        Imagenes: imagenesBase64, // Imágenes de la boleta
      };

      // Llama a saveImages y guarda el resultado
      await saveImages(listaFotos);

      const ACC_ACCESORIOS = boleta.ACC_ACCESORIOS.filter(
        (item) => item.habilitado === true,
      ).map((item) => ({
        ACC_CODE: null,
        EMP_CODE: item.EMP_CODE,
        BOL_CODE: null,
        TIPACC_CODE: item.TIPACC_CODE,
        ACC_VISIBLE: true,
        ACC_CREATEDATE: new Date().toISOString(),
        ACC_UPDATEDATE: new Date().toISOString(),
        ACC_CREATEUSER: user.USU_USERNAME,
        ACC_UPDATEUSER: user.USU_USERNAME,
        ACC_MARCA: item.TIPACC_SETMARCA || '',
        ACC_ESTADO: item.TIPACC_SETESTADO || '',
        ACC_DESCRIPCION: item.TIPACC_SETDESCRIPCION || '',
        ACC_CANTIDAD: item.TIPACC_SETCANTIDAD
          ? parseFloat(item.TIPACC_SETCANTIDAD)
          : 0,
        BOL_BOLETA: null,
        EMP_EMPRESA: null,
        TIPACC_TIPO_ACCESORIO: null,
      }));

      let esquema64 = await generateImageWithPathsInBase64(
        boleta.paths,
        boleta.BOL_VEH_ESTILO,
      );
      let firma64 = await convertSignatureToBase64(boleta.BOL_FIRMA_CLIENTE);

      const VEH_VEHICULO = {
        VEH_CODE: boleta.VEH_CODE,
        EMP_CODE: boleta.EMP_CODE,
        VEH_PLACA: boleta.BOL_VEH_PLACA,
        VEH_MARCA: boleta.BOL_VEH_MARCA,
        VEH_ESTILO: boleta.BOL_VEH_ESTILO,
        VEH_COLOR: boleta.BOL_VEH_COLOR,
        VEH_VISIBLE: true,
        VEH_CREATEDATE: new Date().toISOString(),
        VEH_UPDATEDATE: new Date().toISOString(),
        VEH_CREATEUSER: user.USU_USERNAME,
        VEH_UPDATEUSER: user.USU_USERNAME,
        VEH_ANIO: boleta.BOL_VEH_ANIO,
        CLIE_CODE: boleta.CLI_CODE,
        BOL_BOLETA: [],
        CITCLIE_CITA_CLIENTE: [],
        EMP_EMPRESA: null,
        REGTRA_REGISTRO_TRANSACIONES: [],
        TRABAN_TRANSACCIONES: [],
      };

      const EMP_EMPRESA = {
        EMP_CODE: empresa.EMP_CODE,
        EMP_NOMBRE: empresa.EMP_NOMBRE,
        EMP_LOGO: empresa.EMP_LOGO,
        // EMP_LOGO: '',
        EMP_DIRECCION: empresa.EMP_DIRECCION,
        EMP_EMAIL: empresa.EMP_EMAIL,
        EMP_TELEFONO: empresa.EMP_TELEFONO,
        EMP_FAX: empresa.EMP_FAX,
        EMP_APDO: empresa.EMP_APDO,
        EMP_CEDULA: empresa.EMP_CEDULA,
        EMP_VISIBLE: empresa.EMP_VISIBLE,
        EMP_CREATEDATE: empresa.EMP_CREATEDATE,
        EMP_UPDATEDATE: empresa.EMP_UPDATEDATE,
        EMP_CREATEUSER: empresa.EMP_CREATEUSER,
        EMP_UPDATEUSER: empresa.EMP_UPDATEUSER,
        ACC_ACCESORIOS: [],
        BOL_BOLETA: [],
        CLI_CLIENTE: [],
        TRABAN_TRANSACCIONES: [],
        ESQVEH_ESQUEMA_VEHICULO: [],
        TIPACC_TIPO_ACCESORIO: [],
        TIPDAN_TIPO_DANIO: [],
        TIPTRA_TRIPO_TRABAJO: [],
        TIPVEH_TIPOVEHICULO: [],
        USU_USUARIO: [],
        VEH_VEHICULO: [],
      };

      const boletaData = {
        BOL_CODE: boleta.BOL_CODE,
        EMP_CODE: boleta.EMP_CODE,
        CLI_CODE: boleta.CLI_CODE,
        VEH_CODE: boleta.VEH_CODE,
        TIPTRA_CODE: boleta.TIPTRA_CODE,
        BOL_FECHA: new Date().toISOString(),
        BOL_CLI_NOMBRE: boleta.BOL_CLI_NOMBRE,
        BOL_CLI_TELEFONO: boleta.BOL_CLI_TELEFONO,
        BOL_VEH_PLACA: boleta.BOL_VEH_PLACA,
        BOL_VEH_MARCA: boleta.BOL_VEH_MARCA,
        BOL_VEH_ESTILO: boleta.BOL_VEH_ESTILO,
        BOL_VEH_COLOR: boleta.BOL_VEH_COLOR,
        BOL_VEH_KM: boleta.BOL_VEH_KM,
        BOL_VEH_COMBUSTIBLE: boleta.BOL_VEH_COMBUSTIBLE,
        BOL_CREATEDATE: new Date().toISOString(),
        BOL_UPDATEDATE: new Date().toISOString(),
        BOL_CREATEUSER: user.USU_USERNAME,
        BOL_UPDATEUSER: user.USU_USERNAME,
        BOL_FIRMA_CLIENTE: firma64,
        BOL_FIRMA_CONSENTIMIENTO: firma64,
        // BOL_FIRMA_CLIENTE: '',
        // BOL_FIRMA_CONSENTIMIENTO: '',
        BOL_ENTREGADOPOR: user.USU_USERNAME,
        BOL_OBSERVACIONES: boleta.BOL_OBSERVACIONES,
        BOL_RECIBIDOPOR: user.USU_USERNAME,
        BOL_RECIBIDOCONFORME: boleta.BOL_RECIBIDOCONFORME,
        BOL_CAR_EXQUEMA: esquema64,
        // BOL_CAR_EXQUEMA: boleta.BOL_CAR_EXQUEMA,
        BOL_ESTADO: boleta.BOL_ESTADO,
        BOL_UNWASHED: boleta.BOL_UNWASHED,
        BOL_DELIVERED: boleta.BOL_DELIVERED,
        BOL_CLI_CORREO: boleta.BOL_CLI_CORREO,
        ACC_ACCESORIOS: ACC_ACCESORIOS,
        EMP_EMPRESA: EMP_EMPRESA,
        VEH_VEHICULO: VEH_VEHICULO,
      };

      const respuesta = await createBoleta(boletaData, boleta.CITCLIE_CODE);
      //console.log(boletaData);
      // const respuesta = false;

      if (respuesta) {
        dispatch(resetBoleta());
        dispatch(resetAccesorios());
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
      setIsLoading(false);
      setmodalVisibleBoleta(true);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción" />

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {accesorios.map((accesorio, index) => (
            <View key={index} style={styles.rowContainer}>
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

                {accesorio.habilitado &&
                  (accesorio.TIPACC_SETESTADO !== undefined ||
                    accesorio.TIPACC_SETMARCA !== undefined ||
                    accesorio.TIPACC_SETDESCRIPCION !== undefined ||
                    accesorio.TIPACC_SETCANTIDAD !== undefined) && (
                    <TouchableOpacity
                      style={styles.infoButton}
                      onPress={() => handleToggleInfo(accesorio.TIPACC_CODE)}
                    >
                      <Text style={styles.infoButtonText}>+</Text>
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
                        // value={accesorio.TIPACC_SETMARCA}
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
                        // value={accesorio.TIPACC_SETDESCRIPCION}
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
                        // value={String(accesorio.TIPACC_SETCANTIDAD)}
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
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#FFD700"
            style={styles.spinner}
          />
        )}
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
  spinner: {
    marginTop: 30,
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
    fontWeight: 'bold',
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15, // Botón más grande
    paddingVertical: 10, // Espaciado vertical incrementado
    paddingHorizontal: 15, // Espaciado horizontal incrementado
  },
  infoButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
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
