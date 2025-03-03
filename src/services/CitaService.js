import { get, post } from '../api/config';

const controller = 'Cita';

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
    const response = await get(`${controller}/BuscaModelosApp?pMarca=${marca}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo modelos de vehículos', error);
    throw error;
  }
}

// Función para crear una cita
export async function crearCita(citaDto) {
  try {
    const response = await post(`${controller}/CrearCitaApp`, citaDto);
    return response;
  } catch (error) {
    console.error('Error creando cita:', error);
    throw error;
  }
}

// Función para obtener citas
export async function getCitas(estado, idCita, idSucursal) {
  try {
    // Utiliza el método get para obtener los datos de citas al endpoint
    const data = await get(
      `${controller}/ListCitaApp?estado=${estado}&idCita=${idCita}&idSucursal=${idSucursal}`,
    );
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al obtener citas:', error);
    throw error;
  }
}

export async function tieneCitaActiva(cliCedulaJuri, vehPlaca, apiKeyEmpresa) {
  try {
    const response = await get(
      `${controller}/TieneCitaActivaApp?cliCedulaJuri=${cliCedulaJuri}&vehPlaca=${vehPlaca}&apiKeyEmpresa=${apiKeyEmpresa}`,
    );
    return response; // Devuelve true o false según la respuesta del backend
  } catch (error) {
    console.error('Error al verificar cita activa:', error.message);
    throw error;
  }
}
