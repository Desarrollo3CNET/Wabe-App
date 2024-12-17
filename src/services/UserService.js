import { get } from '../api/config';

// Define el controlador como una constante desacoplada
const controller = 'usuario';

// Función para realizar el login
export async function login(pUsername, pPassword) {
  try {
    const response = await get(
      `/login?pUsername=${pUsername}&pPassword=${pPassword}`,
    );
    return response;
  } catch (error) {
    console.error('Error realizando el login:', error);
    throw error;
  }
}
