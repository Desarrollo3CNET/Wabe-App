import { get } from '../api/config';

const controller = 'Dashboard';

export async function getDashboardData(idEmpresa) {
  try {
    const response = await get(
      `${controller}/GetDashboardApp?idEmpresa=${idEmpresa}`,
    );
    return response;
  } catch (error) {
    console.error('Error obteniendo data del dashboard:', error);
    throw error;
  }
}
