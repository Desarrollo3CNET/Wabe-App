import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setProperty } from '../../src/contexts/BoletaSlice';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import ReusableInput from '../../src/components/recepcion/ReusableInput';
import SignatureInput from '../../src/components/recepcion/SignatureInput';
import DrawingCanvas from '../../src/components/recepcion/DrawingCanvas';
import GenericModal from '../../src/components/recepcion/GenericModal';

const FirmaScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { fromScreen } = route.params || {};

  const boleta = useSelector((state) => state.boleta);
  const { BOL_OBSERVACIONES, BOL_CLI_NOMBRE } = boleta;

  const [modalVisible, setModalVisible] = useState(false); // Modal para firma
  const [modalVisibleBoleta, setModalVisibleBoleta] = useState(false); // Modal genérico
  const [caseType, setCaseType] = useState('CancelBoleta'); // Por defecto es "CancelBoleta"
  const [modalMessage, setModalMessage] = useState(''); // Para el mensaje dinámico

  const handleNext = async () => {
    if (
      boleta.BOL_OBSERVACIONES &&
      boleta.BOL_CLI_NOMBRE &&
      boleta.BOL_FIRMA_CLIENTE
    ) {
      navigation.navigate('PhotosAndVideosScreen', {
        fromScreen: 'FirmaScreen',
      });
    } else {
      // Cambiar el modal a caso "Notificacion" y mostrar mensaje de campos incompletos
      setCaseType('Notificacion');
      setModalMessage(
        'Por favor, complete todos los campos antes de continuar.',
      );
      setModalVisibleBoleta(true);
    }
  };

  const renderFooterButtons = () => {
    switch (fromScreen) {
      case 'VehicleDetailsScreen':
      case 'PhotosAndVideosScreen':
        return (
          <FooterButtons
            onBack={() => navigation.navigate('VehicleDetailsScreen')}
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
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },
});

export default FirmaScreen;
