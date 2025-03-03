import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setProperty } from '../../src/contexts/BoletaSlice';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import ReusableInput from '../../src/components/recepcion/ReusableInput';
import SignatureInput from '../../src/components/recepcion/SignatureInput';
import DrawingCanvas from '../../src/components/recepcion/DrawingCanvas';
import GenericModal from '../../src/components/recepcion/GenericModal';
import { setCreatingBoletaFalse } from '../../src/contexts/AppSlice';
import { resetBoleta, resetAccesorios } from '../../src/contexts/BoletaSlice';
import {
  createBoleta,
  saveImagesBoleta,
} from '../../src/services/BoletaService';
import convertSignatureToBase64 from '../../src/utils/convertSignatureToBase64';
import eventEmitter from '../../src/utils/eventEmitter';

const FirmaScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { fromScreen } = route.params || {};

  const boleta = useSelector((state) => state.boleta);
  const { BOL_OBSERVACIONES, BOL_CLI_NOMBRE } = boleta;
  const empresa = useSelector((state) => state.app.empresa);
  const user = useSelector((state) => state.app.user); // Estado global del usuario

  const [modalVisible, setModalVisible] = useState(false); // Modal para firma
  const [modalVisibleBoleta, setModalVisibleBoleta] = useState(false); // Modal genérico
  const [caseType, setCaseType] = useState('CancelBoleta'); // Por defecto es "CancelBoleta"
  const [modalMessage, setModalMessage] = useState(''); // Para el mensaje dinámico
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el spinner

  const handleNext = async () => {
    setCaseType('Notificacion');
    // Verificar si los campos requeridos están completos
    if (
      !boleta.BOL_OBSERVACIONES ||
      !boleta.BOL_CLI_NOMBRE ||
      !boleta.BOL_FIRMA_CLIENTE
    ) {
      setModalMessage(
        'Por favor, complete todos los campos antes de continuar.',
      );
      setModalVisibleBoleta(true);
      return;
    }

    // Validar que BOL_CLI_NOMBRE no contenga números
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(boleta.BOL_CLI_NOMBRE)) {
      setModalMessage('El nombre del cliente no puede contener números.');
      setModalVisibleBoleta(true);
      return;
    }

    // Validar que BOL_OBSERVACIONES tenga un máximo de 300 caracteres
    if (boleta.BOL_OBSERVACIONES.length > 300) {
      setModalMessage(
        'Las observaciones no pueden superar los 300 caracteres.',
      );
      setModalVisibleBoleta(true);
      return;
    }

    try {
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

      let imagenesBase64 = [];

      if (Array.isArray(boleta.LIST_IMAGES)) {
        // Si la lista de imágenes tiene más de una, usamos map, si tiene solo una imagen, se obtiene directamente
        imagenesBase64 =
          boleta.LIST_IMAGES.length > 1
            ? boleta.LIST_IMAGES.map((image) => image.base64)
            : [boleta.LIST_IMAGES[0]?.base64]; // En caso de que haya solo una imagen, lo convertimos a un array
      } else {
        console.error('boleta.LIST_IMAGES no es un arreglo válido');
      }
      //Prepara el objeto listaFotos con la estructura
      const listaFotos = {
        Fecha: new Date(), // Fecha de hoy en formato ISO 8601
        Placa: boleta.BOL_VEH_PLACA, // Placa desde la boleta
        TipoTrabajo: tipoTrabajo,
        Imagenes: imagenesBase64, // Imágenes de la boleta
      };

      // Llama a saveImagesBoleta y guarda el resultado

      await saveImagesBoleta(listaFotos);

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

      console.log(ACC_ACCESORIOS);

      let firma64 = await convertSignatureToBase64(boleta.BOL_FIRMA_CLIENTE);

      const VEH_VEHICULO = {
        VEH_CODE: boleta.VEH_CODE,
        EMP_CODE: boleta.EMP_CODE,
        VEH_PLACA: boleta.BOL_VEH_PLACA,
        VEH_MARCA: boleta.BOL_VEH_MARCA,
        VEH_ESTILO: boleta.BOL_VEH_MODELO,
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
        BOL_VEH_ESTILO: boleta.BOL_VEH_MODELO,
        BOL_VEH_COLOR: boleta.BOL_VEH_COLOR,
        BOL_VEH_KM: boleta.BOL_VEH_KM,
        BOL_VEH_COMBUSTIBLE: boleta.BOL_VEH_COMBUSTIBLE,
        BOL_CREATEDATE: new Date().toISOString(),
        BOL_UPDATEDATE: new Date().toISOString(),
        BOL_CREATEUSER: user.USU_USERNAME,
        BOL_UPDATEUSER: user.USU_USERNAME,
        BOL_FIRMA_CLIENTE: firma64,
        BOL_FIRMA_CONSENTIMIENTO: firma64,
        BOL_ENTREGADOPOR: user.USU_USERNAME,
        BOL_OBSERVACIONES: boleta.BOL_OBSERVACIONES,
        BOL_RECIBIDOPOR: user.USU_USERNAME,
        BOL_RECIBIDOCONFORME: boleta.BOL_RECIBIDOCONFORME,
        BOL_CAR_EXQUEMA: boleta.BOL_CAR_EXQUEMA,
        BOL_ESTADO: boleta.BOL_ESTADO,
        BOL_UNWASHED: boleta.BOL_UNWASHED,
        BOL_DELIVERED: boleta.BOL_DELIVERED,
        BOL_CLI_CORREO: boleta.BOL_CLI_CORREO,
        ACC_ACCESORIOS: ACC_ACCESORIOS,
        EMP_EMPRESA: EMP_EMPRESA,
        VEH_VEHICULO: VEH_VEHICULO,
      };

      const respuesta = await createBoleta(boletaData, boleta.CITCLIE_CODE);

      if (respuesta) {
        dispatch(resetBoleta());
        dispatch(resetAccesorios());
        dispatch(setCreatingBoletaFalse());
        setModalMessage('Se ha finalizado la boleta correctamente.');
        eventEmitter.emit('refresh');
        navigation.navigate('Dashboard');
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
      setModalVisibleBoleta(true);
    }
  };

  const renderFooterButtons = () => {
    switch (fromScreen) {
      case 'AccesoriosScreen':
        return (
          <FooterButtons
            onBack={() => navigation.navigate('AccesoriosScreen')}
            onDelete={() => {
              setCaseType('CancelBoleta'); // Por defecto "CancelBoleta"
              setModalVisibleBoleta(true);
            }}
            onNext={handleNext}
          />
        );
      case 'BoletaScreen':
        return (
          <FooterButtons
            onBack={() =>
              navigation.navigate('BoletaScreen', {
                fromScreen: 'FirmaScreen',
              })
            }
            showNext={false}
            showDelete={false}
          />
        );
      default:
        return (
          <FooterButtons
            onBack={() => navigation.navigate('Dashboard')}
            showDelete={false}
            showNext={false}
          />
        );
    }
  };

  const handleSaveSignature = (signature) => {
    dispatch(
      setProperty({
        key: 'BOL_FIRMA_CLIENTE', // La clave que queremos actualizar
        value: signature, // El nuevo valor
      }),
    );
    setModalVisible(false); // Cerrar el modal de firma
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Header title="Recepción" />

      {/* Contenido */}
      <View style={styles.content}>
        {/* Input para Observaciones */}
        <ReusableInput
          label="Observaciones"
          placeholder="Escribe las observaciones aquí"
          value={BOL_OBSERVACIONES}
          onChangeText={(text) =>
            dispatch(
              setProperty({
                key: 'BOL_OBSERVACIONES',
                value: text,
              }),
            )
          }
          readOnly={fromScreen === 'BoletaScreen'}
        />

        {/* Input para Nombre */}
        <ReusableInput
          label="Nombre y Apellidos"
          placeholder="Escribe el nombre aquí"
          value={BOL_CLI_NOMBRE}
          onChangeText={(text) =>
            dispatch(
              setProperty({
                key: 'BOL_CLI_NOMBRE',
                value: text,
              }),
            )
          }
          readOnly={fromScreen === 'BoletaScreen'}
        />

        {/* Input para Firma */}
        <SignatureInput
          label="Firma del cliente"
          onEditSignature={() => setModalVisible(true)}
          fromScreen={fromScreen}
        />
      </View>

      {/* Botones de Pie de Página */}
      {renderFooterButtons()}

      {/* Modal para Dibujar la Firma */}
      {modalVisible && (
        <DrawingCanvas
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSave={(signature) => handleSaveSignature(signature)}
        />
      )}

      {/* Modal genérico */}
      <GenericModal
        visible={modalVisibleBoleta}
        onClose={() => setModalVisibleBoleta(false)}
        navigation={navigation}
        caseType={caseType} // Tipo dinámico del caso
        message={modalMessage} // Mensaje dinámico en caso de "Notificacion"
      />
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#FFD700"
          style={styles.spinner}
        />
      )}
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
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },
});

export default FirmaScreen;
