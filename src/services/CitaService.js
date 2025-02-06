import { get } from '../api/config';

const controller = 'Cita';

// Función para obtener citas
export async function getCitas(estado, idCita, idSucursal) {
  try {
    // Utiliza el método get para obtener los datos de citas al endpoint
    const data = await get(
      `Articulo/list?estado=${estado}&idCita=${idCita}&idSucursal=${idSucursal}`,
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

import axios from 'axios';

export async function getHorasDisponibles(fecha) {
  try {
    const response = await axios.get(
      `http://localhost:3000/Citas/ListaHorasDisponiblesApp?fecha=${fecha}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener información de las horas:', error.message);
    throw error;
  }
}

// Función para obtener datos de una cita por placa
export async function getByPlaca(placa) {
  try {
    const response = await axios.get(
      `http://localhost:3000/Citas/ConsultaPlacaApp?placa=${placa}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener información de la cita:', error.message);
    throw error;
  }
}

// Función para obtener datos de una cita por cedula
export async function getByCedula(cedula) {
  try {
    const response = await axios.get(
      `http://localhost:3000/Citas/ConsultaClienteApp?cedula=${cedula}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener información de la cedula:', error.message);
    throw error;
  }
}

// Función para obtener modelos de vehículos por su marca
export async function getModelosByMarca(marca) {
  try {
    const response = await axios.get(
      `http://localhost:3000/Citas/BuscaModelos?pMarca=${marca}`,
    );
    return response;
  } catch (error) {
    console.error('Error obteniendo modelos de vehículos', error);
    throw error;
  }
}
