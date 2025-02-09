import { get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'api/TipoTrabajo';

// Función para obtener los tipos de accesorios por identificador
export async function listTipoTrabajo() {
  try {
    const response = await get(`${controller}/list`);
    return response;
  } catch (error) {
    console.error('Error obteniendo tipos de trabajo:', error);
    throw error;
  }
}
