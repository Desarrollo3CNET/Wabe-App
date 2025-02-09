import { post, get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'Vehicle';

// Función para obtener vehículos por código de empresa
export async function getVehiculosByCodeEmp(codeEmp) {
  try {
    const response = await get(`api/GetVehiculosByCodeEmp?codeEmp=${codeEmp}`);
    return response;
  } catch (error) {
    console.error('Error obteniendo vehículos por código de empresa:', error);
    throw error;
  }
}

// Función para guardar un vehículo
export async function saveVehicle(vehicleData) {
  try {
    const response = await post(`api/SaveVehicle`, vehicleData);
    return response;
  } catch (error) {
    console.error('Error guardando el vehículo:', error);
    throw error;
  }
}
