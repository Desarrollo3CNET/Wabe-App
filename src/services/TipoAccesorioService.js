import { get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'TipoAccesorio';

// Función para obtener el listado de tipos de accesorios
export async function getTipoAccesorios() {
  try {
    const response = await get(`${controller}/List`);
    return response;
  } catch (error) {
    console.error('Error obteniendo los tipos de accesorios:', error);
    throw error;
  }
}

// Función para obtener los tipos de accesorios por identificador
export async function listByIdBol(id) {
  try {
    const response = await get(`${controller}/ListByIdBol?id=${id}`);
    return response;
  } catch (error) {
    console.error(
      'Error obteniendo tipos de accesorios por identificador:',
      error,
    );
    throw error;
  }
}
