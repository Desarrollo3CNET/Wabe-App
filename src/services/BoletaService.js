import { post, get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'Boleta';

// Función para crear una boleta

export async function createBoleta(boletaData, idCita) {
  try {
    const response = await post(`api/SaveBoleta?idCita=${idCita}`, boletaData);
    return response;
  } catch (error) {
    console.error('Error creando boleta:', error);
    throw error;
  }
}

// Función para obtener la lista de boletas
export async function getBoletas(estado, idEmpresa) {
  try {
    const response = await get(
      `${controller}/List?estado=${estado}&idEmpresa=${idEmpresa}`,
    );
    return response;
  } catch (error) {
    console.error('Error obteniendo la lista de boletas:', error);
    throw error;
  }
}

// Función para obtener una boleta específica
export async function getBoletaById(BoletaId) {
  try {
    const response = await get(`${controller}/Read?id=${BoletaId}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo la boleta:', error);
    throw error;
  }
}

// Función para actualizar una boleta
export async function updateBoleta(boletaData) {
  try {
    const response = await post(`${controller}/UpdateBoleta`, boletaData);
    return response;
  } catch (error) {
    console.error('Error actualizando boleta:', error);
    throw error;
  }
}

// Función para reenviar un correo
export async function reenviarCorreo(idBoleta) {
  try {
    const response = await post(`${controller}/CorreoBoleta`, idBoleta);
    return response;
  } catch (error) {
    console.error('Error reenviando un correo:', error);
    throw error;
  }
}

// Función para generar una orden de trabajo
export async function generarOrdenTrabajo(idBoleta) {
  try {
    const response = await get(`${controller}/GenerarOrdenTrabajo`, idBoleta);
    return response;
  } catch (error) {
    console.error('Error obteniendo la boleta:', error);
    throw error;
  }
}
