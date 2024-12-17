import { get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'TipoTrabajoController';

// Función para obtener un tipo de trabajo específico por identificador
export async function getTrabajo(id) {
  try {
    const response = await get(`${controller}/${id}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo tipo de trabajo:', error);
    throw error;
  }
}
