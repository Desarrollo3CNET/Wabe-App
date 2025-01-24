import { post, get } from '../api/config';

// Función para obtener fotos
export async function GetImages(placa, fecha) {
  try {
    // Utiliza el método get para obtener los datos de fotos
    const data = await get(`/GetImages?placa=${placa}&fecha=${fecha}`);
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al obtener fotos:', error);
    throw error;
  }
}
