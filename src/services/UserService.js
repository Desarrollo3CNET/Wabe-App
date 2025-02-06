import { get } from '../api/config';

export async function login(pUsername, pPassword) {
  try {
    const response = await get(
      // `/LoginApp?pUsername=${pUsername}&pPassword=${pPassword}`,
      `/LoginApp?pUsername=${pUsername}&pPassword=${pPassword}`,
    );
    return response;
  } catch (error) {
    console.error('Error realizando el login:', error);
    throw error;
  }
}
