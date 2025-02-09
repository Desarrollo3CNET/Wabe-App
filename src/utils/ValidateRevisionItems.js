export async function ValidateRevisionItems(articulosMantenimiento) {
  for (const categoria of articulosMantenimiento) {
    // Recorremos todos los artículos de la categoría
    for (const articulo of categoria.Articulos) {
      // Validamos que el estado no sea nulo, vacío o string vacío
      if (
        articulo.ESTADO === null ||
        articulo.ESTADO === undefined ||
        articulo.ESTADO === ''
      ) {
        return false; // Si falla, devolvemos false inmediatamente
      }
    }
  }
  return true; // Si todo está bien, devolvemos true
}

export default ValidateRevisionItems;
