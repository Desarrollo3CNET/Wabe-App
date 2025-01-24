export function processAccessories(data) {
  // Verificamos que la data sea un array válido
  if (!Array.isArray(data)) {
    throw new Error('La data proporcionada no es un array válido');
  }

  // Iteramos sobre los accesorios para transformarlos
  return data.map((item) => {
    // Creamos el nuevo objeto con los valores base
    const newItem = {
      id: item.TIPACC_CODE,
      nombre: item.TIPACC_NOMBRE,
      habilitado: false,
      infoVisible: false,
    };

    // Agregamos las propiedades condicionales
    if (item.TIPACC_SETMARCA) {
      newItem.marca = '';
    }
    if (item.TIPACC_SETESTADO) {
      newItem.estado = '';
    }
    if (item.TIPACC_SETDESCRIPCION) {
      newItem.descripcion = '';
    }
    if (item.TIPACC_SETCANTIDAD) {
      newItem.cantidad = 0;
    }

    return newItem;
  });
}
