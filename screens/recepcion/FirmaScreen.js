import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setObservaciones,
  setNombre,
  setFirma,
} from '../../src/contexts/BoletaSlice';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import ReusableInput from '../../src/components/recepcion/ReusableInput';
import SignatureInput from '../../src/components/recepcion/SignatureInput';
import DrawingCanvas from '../../src/components/recepcion/DrawingCanvas';
import CancelBoletaModal from '../../src/components/recepcion/CancelBoletaModal';

const FirmaScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { fromScreen } = route.params || {};

  // Ajuste en el acceso al estado global
  const firmaData = useSelector((state) => state.boleta.firma); // Acceso correcto a "firma" dentro de "vehicleDetails"
  const { observaciones, nombre, firma } = firmaData;

  console.log('firmaData', firmaData);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisibleBoleta, setmodalVisibleBoleta] = useState(false);

  const renderFooterButtons = () => {
    switch (fromScreen) {
      case 'VehicleDetailsScreen':
      case 'PhotosAndVideosScreen':
        return (
          <FooterButtons
            onBack={() => navigation.navigate('VehicleDetailsScreen')}
            onDelete={() => setmodalVisibleBoleta(true)}
            onNext={() =>
              navigation.navigate('PhotosAndVideosScreen', {
                fromScreen: 'FirmaScreen',
              })
            }
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
    dispatch(setFirma(signature)); // Guardar la firma en Redux
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
          value={observaciones} // Ajuste aquí
          onChangeText={(text) => dispatch(setObservaciones(text))}
          readOnly={fromScreen == 'BoletaScreen' ? true : false}
        />

        {/* Input para Nombre */}
        <ReusableInput
          label="Nombre y Apellidos"
          placeholder="Escribe el nombre aquí"
          value={nombre} // Ajuste aquí
          onChangeText={(text) => dispatch(setNombre(text))}
          readOnly={fromScreen == 'BoletaScreen' ? true : false}
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

      {/* CancelBoletaModal */}
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
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },
});

export default FirmaScreen;
