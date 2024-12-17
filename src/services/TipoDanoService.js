import { get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'TipoDanioController';

// Función para obtener el listado de tipos de daño
export async function getTipoDanioController() {
  try {
    const response = await get(`${controller}/List`);
    return response;
  } catch (error) {
    console.error('Error obteniendo el listado de tipos de daño:', error);
    throw error;
  }
}

// Función para obtener un tipo de daño específico por identificador
export async function getTipoDanio(idTipoDanio) {
  try {
    const response = await get(
      `${controller}/GetTipoDanio?idTipoDanio=${idTipoDanio}`,
    );
    return response;
  } catch (error) {
    console.error('Error obteniendo tipo de daño:', error);
    throw error;
  }
}
