export function processCitas(data) {
  const result = [];

  // Iterar sobre cada elemento en el array de datos
  data.forEach((item) => {
    const cita = item.CITA;
    const cliente = item.CLIENTE;
    const vehiculo = item.VEHICULO;

    // Obtener la fecha en formato 'YYYY-MM-DD' de la cita
    const fecha = cita.CITCLIE_FECHA_RESERVA.split('T')[0];

    // Buscar si ya existe un objeto con esta fecha en el resultado
    let fechaObj = result.find((r) => r.fecha === fecha);

    // Si no existe, crear un nuevo objeto para la fecha
    if (!fechaObj) {
      fechaObj = { fecha, citas: [] };
      result.push(fechaObj);
    }

    // Crear el objeto de cita
    const citaObj = {
      cita: {
        idCita: cita.CITCLIE_CODE,
        estado: cita.ESTADO,
        hora: cita.CITCLIE_HORA,
        fecha: cita.CITCLIE_FECHA_RESERVA,
        idSucursal: cita.CITCLIE_SUCURSAL_CODE,
      },
      cliente: {
        idCliente: cliente.CLI_CODE,
        nombre: cliente.CLI_NAME,
        cedula: cliente.CLI_CEDULAJURI,
      },
      vehiculo: {
        idVehiculo: vehiculo.VEH_CODE,
        placa: vehiculo.VEH_PLACA,
        marca: vehiculo.VEH_MARCA,
        estilo: vehiculo.VEH_ESTILO,
        anio: vehiculo.VEH_ANIO,
      },
    };

    // Agregar la cita al array de citas para la fecha correspondiente
    fechaObj.citas.push(citaObj);
  });

  return result;
}
