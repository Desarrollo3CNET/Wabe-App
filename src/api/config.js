import axios from 'axios';

// Creamos una instancia de Axios (api) con la URL base de la API de pruebas.
// Todas las solicitudes posteriores usando api.get, api.post, etc., utilizarán esta URL base
const api = axios.create({
  baseURL: 'http://192.168.1.80:3001/api/',
  //baseURL: 'http://194.168.100.15:44346/api/',
});

// Función para realizar una solicitud GET
export const get = async (url, params = {}) => {
  try {
    // Realizar la solicitud GET usando la instancia de axios configurada
    const response = await api.get(url, { params });

    // Verificar si el código de estado está dentro del rango de éxito (200-299)
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Request failed with status ' + response.status);
    }

    return response.data; // Devolver los datos de la respuesta
  } catch (error) {
    console.error('Error fetching data:', error); // Registrar un error si la solicitud falla
    throw error; // Relanzar el error para manejo adicional si es necesario
  }
};

// Función para realizar una solicitud POST
export const post = async (url, data = {}) => {
  try {
    // Realizar la solicitud POST usando la instancia de axios configurada
    const response = await api.post(url, data);

    // Verificar si el código de estado está dentro del rango de éxito (200-299)
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Request failed with status ' + response.status);
    }

    return response.data; // Devolver los datos de la respuesta
  } catch (error) {
    console.error('Error posting data:', error); // Registrar un error si la solicitud falla
    throw error; // Relanzar el error para manejo adicional si es necesario
  }
};

// Función para realizar una solicitud PUT
export const put = async (url, data = {}) => {
  try {
    // Realizar la solicitud PUT usando la instancia de axios configurada
    const response = await api.put(url, data);

    // Verificar si el código de estado está dentro del rango de éxito (200-299)
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Request failed with status ' + response.status);
    }

    return response.data; // Devolver los datos de la respuesta
  } catch (error) {
    console.error('Error updating data:', error); // Registrar un error si la solicitud falla
    throw error; // Relanzar el error para manejo adicional si es necesario
  }
};

// Función para realizar una solicitud DELETE
export const del = async (url) => {
  try {
    // Realizar la solicitud DELETE usando la instancia de axios configurada
    const response = await api.delete(url);

    // Verificar si el código de estado está dentro del rango de éxito (200-299)
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Request failed with status ' + response.status);
    }

    return response.data; // Devolver los datos de la respuesta
  } catch (error) {
    console.error('Error deleting data:', error); // Registrar un error si la solicitud falla
    throw error; // Relanzar el error para manejo adicional si es necesario
  }
};
