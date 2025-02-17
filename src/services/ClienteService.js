import { post, get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'Cliente';

// Función para crear un cliente
export async function createClient(clientData) {
  try {
    const response = await post(`${controller}/SaveClienteApp`, clientData);
    return response;
  } catch (error) {
    console.error('Error creando cliente:', error);
    throw error;
  }
}
