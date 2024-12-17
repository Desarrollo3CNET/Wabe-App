import { post, get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'Cliente';

// Función para crear un cliente
export async function createClient(clientData) {
  try {
    const response = await post(`${controller}/SaveCliente`, clientData);
    return response;
  } catch (error) {
    console.error('Error creando cliente:', error);
    throw error;
  }
}

// Función para obtener los clientes
export async function getClients() {
  try {
    const response = await get(`${controller}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo los clientes:', error);
    throw error;
  }
}
