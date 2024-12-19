import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setObservaciones,
  setNombre,
  setFirma,
} from '../../src/contexts/store';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import ReusableInput from '../../src/components/recepcion/ReusableInput';
import SignatureInput from '../../src/components/recepcion/SignatureInput';
import DrawingCanvas from '../../src/components/recepcion/DrawingCanvas';

const FirmaScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { observaciones, nombre, firma } = useSelector((state) => state.firma);
  const [modalVisible, setModalVisible] = React.useState(false);

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
          value={observaciones}
          onChangeText={(text) => dispatch(setObservaciones(text))}
        />

        {/* Input para Nombre */}
        <ReusableInput
          label="Nombre y Apellidos"
          placeholder="Escribe el nombre aquí"
          value={nombre}
          onChangeText={(text) => dispatch(setNombre(text))}
        />

        {/* Input para Firma */}
        <SignatureInput
          label="Firma del cliente"
          onEditSignature={() => setModalVisible(true)}
          signature={firma}
        />
      </View>

      {/* Botones de Pie de Página */}
      <FooterButtons
        onBack={() => navigation.navigate('VehicleDetailsScreen')}
        onDelete={() => console.log('Eliminar Boleta')}
        onNext={() => navigation.navigate('PhotosAndVideosScreen')}
      />

      {/* Modal para Dibujar la Firma */}
      {modalVisible && (
        <DrawingCanvas
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSave={(signature) => handleSaveSignature(signature)}
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
  content: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },
});

export default FirmaScreen;
