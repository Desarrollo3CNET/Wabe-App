import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { setLoggedIn } from '../src/contexts/store';
import logonegro from '../assets/logonegro.png';

const Login = () => {
  const [usuario, setUsuario] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setUsuario((prevUsuario) => ({ ...prevUsuario, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!usuario.email || !usuario.password) {
      alert('Por favor, ingrese usuario y contraseña.');
      return;
    }

    try {
      // const response = await login(usuario.email, usuario.password);
      // if (response.status === 200) {
      //   const userSession = await response.json();
      //   await AsyncStorage.setItem('session', JSON.stringify(userSession));
      //   dispatch(setLoggedIn(userSession));
      //   navigation.replace('Inicio');
      // } else if (response.status === 401) {
      //   alert('Usuario o contraseña incorrectos.');
      // } else {
      //   alert('Error en el servidor. Inténtalo más tarde.');
      // }

      const mockUserSession = {
        id: 1,
        name: 'Usuario de Pruebas',
        email: usuario.email,
      };
      await AsyncStorage.setItem('session', JSON.stringify(mockUserSession));
      dispatch(setLoggedIn(mockUserSession));
      navigation.replace('Dashboard');
    } catch (error) {
      console.error('Error al realizar el login:', error);
      alert('Error al realizar el login. Inténtalo más tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logonegro} style={styles.logo} />
      <Text style={styles.title}>Iniciar sesión</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Usuario</Text>
        <TextInput
          value={usuario.email}
          onChangeText={(value) => handleInputChange('email', value)}
          placeholder="Ingresa tu usuario"
          placeholderTextColor="#fff"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Contraseña</Text>
        <TextInput
          value={usuario.password}
          onChangeText={(value) => handleInputChange('password', value)}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#fff"
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Ingresar →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
  },
  forgotPassword: {
    color: '#aaa',
    marginBottom: 40,
    textDecorationLine: 'underline',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFD700',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Login;
