import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { Svg, Path, SvgXml } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Buffer } from 'buffer';

const SignatureInput = ({ label, onEditSignature, fromScreen }) => {
  // Obtiene la firma desde Redux
  const signaturePaths = useSelector((state) => state.boleta.BOL_FIRMA_CLIENTE);
  const isCreatingBoleta = useSelector((state) => state.app.isCreatingBoleta);

  // Decodifica Base64 a string
  const decodeBase64ToString = (base64String) => {
    if (!base64String) return null;
    return Buffer.from(base64String, 'base64').toString('utf-8');
  };

  // Verifica si es un archivo SVG o una imagen PNG/JPG
  const signatureData = decodeBase64ToString(signaturePaths);
  const isSVG = signatureData?.trim().startsWith('<svg');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.signatureBox}>
        {isCreatingBoleta ? (
          signaturePaths &&
          Array.isArray(signaturePaths) &&
          signaturePaths.length > 0 ? (
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
          )
        ) : signatureData ? (
          isSVG ? (
            <SvgXml xml={signatureData} width="100%" height="100%" />
          ) : (
            <Image
              source={{ uri: `data:image/png;base64,${signaturePaths}` }}
              style={styles.signatureImage}
              resizeMode="contain"
            />
          )
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
    width: '100%',
    height: '100%',
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
