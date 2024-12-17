import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignatureInput = ({ label, onEditSignature }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.signatureBox}>
        <Text style={styles.signature}>[Firma del cliente]</Text>
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
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signature: {
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
