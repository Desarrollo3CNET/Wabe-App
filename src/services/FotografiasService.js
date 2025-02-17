import { get, post } from '../api/config';

const controller = 'Image';

// Función para obtener fotos
export async function GetImages(placa, fecha) {
  try {
    // Utiliza el método get para obtener los datos de fotos
    const data = await get(
      `${controller}/GetImagesApp?placa=${placa}&fecha=${fecha}`,
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
export async function saveImages(listaFotos) {
  try {
    // Utiliza el método post para enviar los datos de fotos al endpoint
    const data = await post(`${controller}/SaveImagesApp`, listaFotos);
    return data;
  } catch (error) {
    // Maneja errores en caso de fallos en la solicitud
    console.error('Error al guardar fotos:', error);
    throw error;
  }
}
