import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import ReusableInput from '../../src/components/recepcion/ReusableInput';
import SignatureInput from '../../src/components/recepcion/SignatureInput';
import DrawingCanvas from '../../src/components/recepcion/DrawingCanvas';

const FirmaScreen = ({ navigation }) => {
  const [observaciones, setObservaciones] = useState('');
  const [nombre, setNombre] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [savedSignature, setSavedSignature] = useState(null);

  const handleSaveSignature = (signature) => {
    console.log('Firma Guardada:', signature);
    setSavedSignature(signature);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción" />

      <View style={styles.content}>
        <ReusableInput
          label="Observaciones"
          placeholder="Escribe las observaciones aquí"
          value={observaciones}
          onChangeText={setObservaciones}
        />

        <ReusableInput
          label="Nombre y Apellidos"
          placeholder="Escribe el nombre aquí"
          value={nombre}
          onChangeText={setNombre}
        />

        <SignatureInput
          label="Firma del cliente"
          onEditSignature={() => setModalVisible(true)}
        />
      </View>

      <FooterButtons
        onBack={() => navigation.goBack()}
        onDelete={() => console.log('Eliminar Boleta')}
        onNext={() => navigation.navigate('PhotosAndVideosScreen')}
      />

      {modalVisible && (
        <DrawingCanvas
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          l
          onSave={(paths) => {
            console.log('Paths guardados:', paths);
            setSavedSignature(paths);
            setModalVisible(false);
          }}
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
