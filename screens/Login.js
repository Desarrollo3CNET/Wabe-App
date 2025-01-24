import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { setLoggedIn } from '../src/contexts/AppSlice';
import { login } from '../src/services/UserService'; // Importa la función login
import logonegro from '../assets/logonegro.png';

const Login = () => {
  const [usuario, setUsuario] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setUsuario((prevUsuario) => ({ ...prevUsuario, [name]: value }));
    setErrorMessage(''); // Limpia el mensaje de error al escribir
  };

  const handleSubmit = async () => {
    setLoading(true); // Inicia la carga

    try {
      const response = await login('smaranini', '123'); // Llamada al backend

      if (response && response.USU_CODE) {
        // Guarda la respuesta completa en AsyncStorage
        await AsyncStorage.setItem('session', JSON.stringify(response));

        // Actualiza el estado global en Redux
        dispatch(setLoggedIn(response));

        // Redirige al Dashboard o pantalla principal
        navigation.replace('Dashboard');
      } else {
        Alert.alert(
          'Error de autenticación',
          'Usuario o contraseña incorrectos. Por favor, verifique sus credenciales.',
        );
      }
    } catch (error) {
      console.error('Error al realizar el login:', error);
      Alert.alert(
        'Error del servidor',
        'Hubo un problema al intentar iniciar sesión. Intente nuevamente más tarde.',
      );
    } finally {
      setLoading(false); // Finaliza la carga
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

      {/* Mensaje de error */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.buttonText}>Ingresar →</Text>
        )}
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
});

export default Login;
