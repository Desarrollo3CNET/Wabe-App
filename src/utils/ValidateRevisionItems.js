export async function ValidateRevisionItems(articulos) {
  for (const articulo of articulos) {
    // Validamos que el estado no sea nulo, vacío o string vacío
    if (
      articulo.ESTADO === null ||
      articulo.ESTADO === undefined ||
      articulo.ESTADO === ''
    ) {
      return false; // Si falla, devolvemos false inmediatamente
    }
  }
  return true;
}
export default ValidateRevisionItems;
