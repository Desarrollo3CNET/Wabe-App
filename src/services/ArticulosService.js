import { get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'Articulo';

// Función para obtener el listado de tipos de articulos
export async function getArticulosByBoleta(BoletaId) {
  try {
    const response = await get(
      `${controller}/GetArticulosBoletaApp?bolCode=${BoletaId}`,
    );
    return response;
  } catch (error) {
    console.error('Error obteniendo los tipos de articulos:', error);
    throw error;
  }
}

// Función para obtener el listado de articulos en mantenimiento
export async function ObtenerArticulosMantenimiento() {
  try {
    const response = await get(
      `${controller}/ObtenerArticulosMantenimientoApp`,
    );
    return response;
  } catch (error) {
    console.error('Error obteniendo los tipos de articulos:', error);
    throw error;
  }
}
