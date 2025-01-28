export async function ValidateRevisionItems(data) {
  return data.every((item) => {
    // Caso 1: Validar estadoIzquierda y estadoDerecha (si existen)
    if ('estadoIzquierda' in item || 'estadoDerecha' in item) {
      return (
        (item.estadoIzquierda && item.estadoIzquierda.trim() !== '') ||
        (item.estadoDerecha && item.estadoDerecha.trim() !== '')
      );
    }

    // Caso 2: Validar estadoGeneral (si es la única propiedad de estado)
    if ('estadoGeneral' in item) {
      return item.estadoGeneral !== null && item.estadoGeneral.trim() !== '';
    }

    // Caso 3: Validar estado (si está presente, como en "Servicios")
    if ('estado' in item) {
      return item.estado !== null && item.estado.trim() !== '';
    }

    // Si no tiene ninguna propiedad relacionada al estado, lo consideramos válido
    return true;
  });
}

export default ValidateRevisionItems;
