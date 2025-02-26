import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FooterButtonsRevision = ({
  onBack,
  onDelete,
  onNext,
  showBack = true,
  showDelete = true,
  showNext = true,
}) => {
  return (
    <View style={styles.footer}>
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={30} color="#000" />
        </TouchableOpacity>
      )}
      {showDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Icon name="plus" size={30} color="#000" />
        </TouchableOpacity>
      )}
      {showNext && (
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Icon name="arrow-right" size={30} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centrado del contenido
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centrado del contenido
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centrado del contenido
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 5,
  },
});

export default FooterButtonsRevision;
