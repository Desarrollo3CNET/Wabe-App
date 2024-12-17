import { get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'dashboard';

// Función para obtener datos del dashboard
export async function getDashboardData() {
  try {
    const response = await get(`${controller}/GetData`);
    return response;
  } catch (error) {
    console.error('Error obteniendo datos del dashboard:', error);
    throw error;
  }
}
