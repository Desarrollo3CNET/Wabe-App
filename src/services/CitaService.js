import { get, post } from '../api/config';

const controller = 'Citas';

export async function getHorasDisponibles(fecha) {
  try {
    const response = await get(
      `${controller}/ListaHorasDisponiblesApp?fecha=${fecha}`,
    );
    return response;
  } catch (error) {
    console.error('Error al obtener información de las horas:', error.message);
    throw error;
  }
}

// Función para obtener datos de una cita por placa
export async function getByPlaca(placa) {
  try {
    const response = await get(`${controller}/ConsultaPlacaApp?placa=${placa}`);
    return response;
  } catch (error) {
    console.error('Error al obtener información de la cita:', error.message);
    throw error;
  }
}

// Función para obtener datos de una cita por cedula
export async function getByCedula(cedula) {
  try {
    const response = await get(
      `${controller}/ConsultaClienteApp?cedula=${cedula}`,
    );
    return response;
  } catch (error) {
    console.error('Error al obtener información de la cedula:', error.message);
    throw error;
  }
}

// Función para obtener modelos de vehículos por su marca
export async function getModelosByMarca(marca) {
  try {
    const response = await get(`${controller}/BuscaModelos?pMarca=${marca}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo modelos de vehículos', error);
    throw error;
  }
}

// Función para crear una cita
export async function crearCita(cliente, cita, vehiculo) {
  try {
    const response = await post(
      `${controller}/CrearCitaAsyncAPP`,
      cliente,
      cita,
      vehiculo,
    );

    return response;
  } catch (error) {
    console.error('Error creando cita:', error);
    throw error;
  }
}
