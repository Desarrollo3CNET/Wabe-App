import { get } from '../api/config';

const controller = 'Empresa';

export async function ReadEmpresa(empcode) {
  try {
    const response = await get(
      `${controller}/ReadEmpresaApp?empcode=${empcode}`,
    );
    return response;
  } catch (error) {
    console.error('Error obteniendo empresa:', error);
    throw error;
  }
}
