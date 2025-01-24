import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const ReusableInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  readOnly = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#aaa"
        readOnly={readOnly}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    paddingVertical: 5,
    color: '#000',
  },
});

export default ReusableInput;
