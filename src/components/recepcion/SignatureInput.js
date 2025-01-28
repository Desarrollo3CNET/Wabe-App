import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignatureInput = ({ label, onEditSignature, fromScreen }) => {
  // Accede a la firma guardada en Redux
  const signaturePaths = useSelector((state) => state.boleta.BOL_FIRMA_CLIENTE);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.signatureBox}>
        {fromScreen === 'BoletaScreen' ? (
          // Renderiza la firma como imagen si la variable está en base64
          signaturePaths ? (
            <Image
              source={{ uri: `data:image/png;base64,${signaturePaths}` }}
              style={styles.signatureImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.signaturePlaceholder}>[Firma del cliente]</Text>
          )
        ) : // Renderiza los paths (dibujo) si no es BoletaScreen
        signaturePaths && signaturePaths.length > 0 ? (
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 300 150"
            preserveAspectRatio="xMinYMin meet"
          >
            {signaturePaths.map((path, index) => (
              <Path
                key={index}
                d={path}
                stroke="black"
                strokeWidth={2}
                fill="none"
              />
            ))}
          </Svg>
        ) : (
          <Text style={styles.signaturePlaceholder}>[Firma del cliente]</Text>
        )}
      </View>
      {fromScreen !== 'BoletaScreen' && (
        <TouchableOpacity style={styles.editButton} onPress={onEditSignature}>
          <Icon name="pencil" size={20} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  signatureBox: {
    height: 150,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  signaturePlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  signatureImage: {
    height: '50%', // Hace que la imagen sea más pequeña
    width: '50%', // Ajusta proporcionalmente
    position: 'absolute', // Permite centrarla
    top: '25%', // Centra verticalmente
    left: '25%', // Centra horizontalmente
  },
  editButton: {
    position: 'absolute',
    right: 10,
    top: 30,
    backgroundColor: '#FFD700',
    borderRadius: 50,
    padding: 10,
  },
});

export default SignatureInput;
