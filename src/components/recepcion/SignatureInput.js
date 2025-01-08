import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignatureInput = ({ label, onEditSignature }) => {
  // Accede a la firma guardada en Redux
  const signaturePaths = useSelector((state) => state.firma.firma);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.signatureBox}>
        {signaturePaths && signaturePaths.length > 0 ? (
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 300 150"
            preserveAspectRatio="xMinYMin meet" // Asegura que se alinee a la izquierda
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
      <TouchableOpacity style={styles.editButton} onPress={onEditSignature}>
        <Icon name="pencil" size={20} color="#000" />
      </TouchableOpacity>
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
    alignItems: 'flex-start', // Alinea el contenido a la izquierda
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  signaturePlaceholder: {
    fontSize: 16,
    color: '#999',
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
