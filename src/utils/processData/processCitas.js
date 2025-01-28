export function processCitas(data) {
  const result = [];

  // Iterar sobre cada elemento en el array de datos
  data.forEach((item) => {
    const { OTRE_ORDENTRABAJO_ENCABEZADO, ...clienteFiltrade } = item.CLIENTE;
    const { TRABAN_TRANSACCIONES, VEH_VEHICULO, ...citaFiltrade } = item.CITA;
    const { BOL_BOLETA, CITCLIE_CITA_CLIENTE, ...vehiculoFiltrade } =
      item.VEHICULO;

    // Crear el objeto de cita
    const citaObj = {
      CLIENTE: clienteFiltrade,
      CITA: citaFiltrade,
      VEHICULO: vehiculoFiltrade,
    };

    // Agregar la cita al array de citas para la fecha correspondiente
    result.push(citaObj);
  });

  return result;
}
