import { post } from '../api/config';

const controller = 'Accesorio';

// Función para guardar accesorios
export async function saveAccesories(accesoriesData) {
  try {
    // Utiliza el método post para enviar los datos de accesorios al endpoint
    const data = await post(`${controller}/Save`, accesoriesData);
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al guardar accesorios:', error);
    throw error;
  }
}
