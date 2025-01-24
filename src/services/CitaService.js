import { post, get } from '../api/config';

const controller = 'Cita';

// Función para obtener citas
export async function getCitas(estado, idCita, idSucursal) {
  try {
    // Utiliza el método get para obtener los datos de citas al endpoint
    const data = await get(
      `${controller}/list?estado=${estado}&idCita=${idCita}&idSucursal=${idSucursal}`,
    );
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al obtener citas:', error);
    throw error;
  }
}

// Función para obtener sucursales
export async function getSucursales(idEmpresa) {
  try {
    // Utiliza el método get para obtener los datos de sucursales al endpoint
    const data = await get(`ListSucursales?idEmpresa=${idEmpresa}`);
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al obtener sucursales:', error);
    throw error;
  }
}
