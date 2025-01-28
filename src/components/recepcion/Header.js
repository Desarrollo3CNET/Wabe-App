import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetState } from '../../contexts/AppSlice'; // Importa la acción de tu slice

const Header = ({ title }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Elimina la sesión de AsyncStorage
      await AsyncStorage.removeItem('session');

      // Resetea el estado global en Redux
      dispatch(resetState());

      // Redirige al usuario a la pantalla de Login
      navigation.replace('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon name="bars" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.headerText}>{title}</Text>

      <TouchableOpacity onPress={handleLogout}>
        <Icon name="sign-out" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Header;
