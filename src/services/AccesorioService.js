import { get } from '../api/config';

const controller = 'TipoAccesorio';

// Función para obtener accesorios
export async function getAccesories() {
  try {
    // Utiliza el método get para obtener los datos de accesorios al endpoint
    // const data = await get(`${controller}/ListApp`);
    const data = await get(`${controller}/List`);
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
    const data = await get(`${controller}/ListByIdBol?id=${BoletaId}`);
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al obtener accesorios:', error);
    throw error;
  }
}
