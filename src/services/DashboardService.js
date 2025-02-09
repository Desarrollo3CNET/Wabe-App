import { get } from '../api/config';

const controller = 'api/dashboard';

export async function getDashboardData(idEmpresa) {
  try {
    const response = await get(`${controller}/GetData?idEmpresa=${idEmpresa}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo data del dashboard:', error);
    throw error;
  }
}

// Función para obtener citas
export async function getCitas(estado, idCita, idSucursal) {
  try {
    // Utiliza el método get para obtener los datos de citas al endpoint
    const data = await get(
      `${controller}/ListAPP?estado=${estado}&idCita=${idCita}&idSucursal=${idSucursal}`,
    );
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al obtener citas:', error);
    throw error;
  }
}

// http://localhost:3000/api/dashboard/ListAPP?estado=-10&idCita=-1&idSucursal=1
