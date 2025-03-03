import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import ZoomBar from '../../src/components/recepcion/ZoomBar';

import { useSelector } from 'react-redux';

const GolpesScreen = ({ navigation, route }) => {
  const esquema = useSelector((state) => state.boleta.BOL_CAR_EXQUEMA);
  const [zoom, setZoom] = useState(1);

  const decodeBase64Image = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción" />

      <View style={styles.content}>
        <Text style={styles.title}>Golpes</Text>
        {esquema && (
          <>
            <Image
              source={{ uri: decodeBase64Image(esquema) }}
              style={[
                styles.largeImage,
                {
                  transform: [{ scale: zoom }],
                  width: 'auto', // Ajuste para que la imagen no se deforme
                },
              ]}
            />
            <ZoomBar zoom={zoom} setZoom={setZoom} />
          </>
        )}
      </View>

      <FooterButtons
        onBack={() =>
          navigation.navigate('FirmaScreen', {
            fromScreen: 'GolpesScreen',
          })
        }
        showNext={false}
        showDelete={false}
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
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  largeImage: {
    width: '90%', // Ajusta el ancho de la imagen
    height: '70%', // Ajusta la altura de la imagen
    resizeMode: 'contain', // Mantiene la relación de aspecto
  },
});

export default GolpesScreen;
