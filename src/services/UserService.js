import { get } from '../api/config';

const controller = 'Usuario';

export async function login(pUsername, pPassword) {
  try {
    const response = await get(
      `${controller}/LoginApp?pUsername=${pUsername}&pPassword=${pPassword}`,
    );
    return response;
  } catch (error) {
    console.error('Error realizando el login:', error);
    throw error;
  }
}
