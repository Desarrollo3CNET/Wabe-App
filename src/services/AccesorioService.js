import { post, get } from '../api/config';

const controller1 = 'Accesorio';
const controller2 = 'TipoAccesorio';

// Función para guardar accesorios
export async function saveAccesories(accesoriesData) {
  try {
    // Utiliza el método post para enviar los datos de accesorios al endpoint
    const data = await post(`${controller1}/Save`, accesoriesData);
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al guardar accesorios:', error);
    throw error;
  }
}

// Función para obtener accesorios
export async function getAccesories() {
  try {
    // Utiliza el método get para obtener los datos de accesorios al endpoint
    const data = await get(`${controller2}/List`);
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al obtener accesorios:', error);
    throw error;
  }
}

// Función para obtener accesorios por boleta
export async function getAccesoriesByBoleta(BoletaId) {
  try {
    // Utiliza el método get para obtener los datos de accesorios al endpoint
    const data = await get(`${controller2}/ListByIdBol?id=${BoletaId}`);
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al obtener accesorios:', error);
    throw error;
  }
}
