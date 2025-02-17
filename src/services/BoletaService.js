import { post, get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'Boleta';

// Función para obtener sucursales
export async function getSucursales(idEmpresa) {
  try {
    // Utiliza el método get para obtener los datos de sucursales al endpoint
    const data = await get(
      `${controller}/ListSucursalesApp?idEmpresa=${idEmpresa}`,
    );
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al obtener sucursales:', error);
    throw error;
  }
}

// Función para obtener la lista de boletas
export async function getBoletas(estado, idEmpresa) {
  try {
    const response = await get(
      `${controller}/ListBoletaApp?estado=${estado}&idEmpresa=${idEmpresa}`,
    );
    return response;
  } catch (error) {
    console.error('Error obteniendo la lista de boletas:', error);
    throw error;
  }
}

export async function createBoleta(boletaData) {
  try {
    const response = await post(`${controller}/SaveBoletaApp`, boletaData);
    return response;
  } catch (error) {
    console.error('Error creando boleta:', error);
    throw error;
  }
}
// Función para obtener una boleta específica
export async function getBoletaById(BoletaId) {
  try {
    const response = await get(`${controller}/ReadApp?id=${BoletaId}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo la boleta:', error);
    throw error;
  }
}

// Función para actualizar una boleta
export async function updateBoleta(boletaData) {
  try {
    const response = await post(`${controller}/UpdateBoletaApp`, boletaData);
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

// Función para guardar artículos
export async function saveArticulos(
  idBoleta,
  observaciones,
  idEmpresa,
  listArticulos,
) {
  try {
    const response = await post(
      `${controller}/SaveArt?idBoleta=${idBoleta}&observaciones=${observaciones}&idEmpresa=${idEmpresa}`,
      listArticulos,
    );
    return response;
  } catch (error) {
    console.error('Error guardando artículo:', error);
    throw error;
  }
}
