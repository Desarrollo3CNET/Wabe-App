import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FooterButtons = ({
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
          <Icon name="trash" size={30} color="#000" />
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
    justifyContent: 'center', // Centrar el icono
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centrar el icono
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centrar el icono
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
});

export default FooterButtons;
