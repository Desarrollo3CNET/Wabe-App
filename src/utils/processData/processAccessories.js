export async function processAccessories(data) {
  // Verificamos que la data sea un array válido
  if (!Array.isArray(data)) {
    throw new Error('La data proporcionada no es un array válido');
  }

  // Iteramos sobre los accesorios para transformarlos
  return data.map((item) => {
    // Creamos el nuevo objeto con los valores base
    const newItem = {
      TIPACC_CODE: item.TIPACC_CODE,
      EMP_CODE: item.EMP_CODE,
      TIPACC_NOMBRE: item.TIPACC_NOMBRE,
      TIPACC_VISIBLE: item.TIPACC_VISIBLE,
      TIPACC_CREATEDATE: item.TIPACC_CREATEDATE,
      TIPACC_UPDATEDATE: item.TIPACC_UPDATEDATE,
      TIPACC_CREATEUSER: item.TIPACC_CREATEUSER,
      TIPACC_UPDATEUSER: item.TIPACC_UPDATEUSER,
      habilitado: false,
      infoVisible: false,
    };

    // Agregamos las propiedades condicionales
    if (item.TIPACC_SETMARCA) {
      newItem.TIPACC_SETMARCA = '';
    }
    if (item.TIPACC_SETESTADO) {
      newItem.TIPACC_SETESTADO = '';
    }
    if (item.TIPACC_SETDESCRIPCION) {
      newItem.TIPACC_SETDESCRIPCION = '';
    }
    if (item.TIPACC_SETCANTIDAD) {
      newItem.TIPACC_SETCANTIDAD = 0;
    }

    return newItem;
  });
}
