import { get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'Articulo';

// Función para obtener el listado de tipos de articulos
export async function getArticulosByBoleta(BoletaId) {
  try {
    const response = await get(`${controller}/GetByBoletaApp?id=${BoletaId}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo los tipos de articulos:', error);
    throw error;
  }
}

// Función para obtener el listado de articulos en mantenimiento
export async function ObtenerArticulosMantenimiento(idEmpresa) {
  try {
    const response = await get(
      `${controller}/ObtenerArticulosMantenimientoApp?idEmpresa=${idEmpresa}`,
    );
    return response;
  } catch (error) {
    console.error('Error obteniendo los tipos de articulos:', error);
    throw error;
  }
}
