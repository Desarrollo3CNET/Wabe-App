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

export async function createBoleta(boletaData, idCita) {
  try {
    const response = await post(
      `${controller}/SaveBoletaApp?idCita=${idCita}`,
      boletaData,
    );
    return response;
  } catch (error) {
    console.error('Error creando boleta:', error.message);
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

// Función para reenviar un correo
export async function reenviarCorreo(idBoleta) {
  try {
    const response = await get(
      `${controller}/CorreoBoletaApp? bbbbbbb idBoleta=${idBoleta}`,
    );
    return response;
  } catch (error) {
    console.error('Error reenviando un correo:', error);
    throw error;
  }
}

// Función para generar una orden de trabajo
export async function generarOrdenTrabajo(idBoleta) {
  try {
    const response = await get(
      `${controller}/GenerarOrdenTrabajoApp?idBoleta=${idBoleta}`,
    );
    return response;
  } catch (error) {
    console.error('Error obteniendo la boleta:', error);
    throw error;
  }
}

// Función para guardar artículos
export async function saveArticulos(listArticulos) {
  try {
    const response = await post(`${controller}/SaveArtApp`, listArticulos);
    return response;
  } catch (error) {
    console.error('Error guardando artículo:', error);
    throw error;
  }
}

// Función para guardar fotos
export async function saveImagesArticulos(listaArticulos) {
  try {
    // Utiliza el método post para enviar los datos de fotos al endpoint
    const data = await post(
      `${controller}/SaveImagesArticulosApp`,
      listaArticulos,
    );
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al guardar fotos:', error);
    throw error;
  }
}

// Función para obtener fotos
export async function GetImagesBoleta(placa, fecha) {
  try {
    // Utiliza el método get para obtener los datos de fotos
    const data = await get(
      `${controller}/GetImagesBoletaApp?placa=${placa}&fecha=${fecha}`,
    );

    // Verifica si el mensaje indica que no se encontraron imágenes
    if (
      data?.Message ===
      'No se encontraron imágenes para la placa y fecha proporcionadas.'
    ) {
      return {}; // Devuelve un objeto vacío
    }

    return data; // Devuelve los datos si existen
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al obtener fotos:', error);
    throw error;
  }
}

// Función para guardar fotos
export async function saveImagesBoleta(listaFotos) {
  try {
    // Utiliza el método post para enviar los datos de fotos al endpoint
    const data = await post(`${controller}/SaveImagesBoletaApp`, listaFotos);
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al guardar fotos:', error);
    throw error;
  }
}
