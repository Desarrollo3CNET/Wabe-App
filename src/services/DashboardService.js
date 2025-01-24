import { get } from '../api/config';

const controller = 'dashboard';

export async function getDashboardData(idEmpresa) {
  try {
    const response = await get(`${controller}/GetData?idEmpresa=${idEmpresa}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo data del dashboard:', error);
    throw error;
  }
}
