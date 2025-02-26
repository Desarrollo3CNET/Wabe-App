import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Header from '../src/components/recepcion/Header';
import CustomInput from '../src/components/CustomInput';
import FooterButtons from '../src/components/recepcion/FooterButtons';
import AppointmentScheduler from '../src/components/AppointmentScheduler';
import GenericModal from '../src/components/recepcion/GenericModal';
import {
  getByCedula,
  getByPlaca,
  getModelosByMarca,
  crearCita,
  tieneCitaActiva,
} from '../src/services/CitaService';
import { getSucursales } from '../src/services/BoletaService';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { marcas } from '../src/utils/dataMarcas';
const ScheduleAppointmentScreen = ({ navigation }) => {
  const [appointmentDetails, setAppointmentDetails] = useState({
    placa: '',
    marca: '',
    estilo: '',
    anio: '',
    cedula: '',
    nombre: '',
    telefono: '',
    correo: '',
    direccion: '',
    sucursal: '',
    fecha: '',
    hora: '',
    tipoCedula: 1,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const user = useSelector((state) => state.app.user);
  const [sucursal, setSucursal] = useState();
  const [sucursalOptions, setSucursalOptions] = useState([]);
  const [modelos, setModelos] = useState([]);

  const [messages, setMessages] = useState({
    placa: '',
    cedula: '',
  });

  // Función para actualizar los valores del formulario
  const handleUpdate = async (field, value) => {
    setAppointmentDetails((prev) => ({ ...prev, [field]: value }));

    if (field === 'placa' && value) {
      try {
        const data = await getByPlaca(value);

        if (data) {
          setAppointmentDetails((prev) => ({
            ...prev,
            marca: data.marca,
            estilo: data.estilo,
            anio: data.anio.toString(),
            // nombre: data.cliente.nombre,
            // telefono: data.cliente.telefono,
            // correo: data.cliente.correo,
            // direccion: data.cliente.direccion,
            // cedula: data.cliente.cedula,
            // tipoCliente: data.cliente.tipoCliente,
          }));
          setMessages((prev) => ({
            ...prev,
            placa: 'Vehículo encontrado.',
          }));
          fetchModelosByMarca(data.marca);
        } else {
          setMessages((prev) => ({
            ...prev,
            placa: 'No se encontraron datos para esta placa.',
          }));
        }
      } catch (error) {
        setMessages((prev) => ({
          ...prev,
          placa: 'Error al buscar la placa.',
        }));
      }
    }

    // if (field === 'cedula' && value) {
    //   try {
    //     const data = await getByCedula(value);
    //     if (data) {
    //       setAppointmentDetails((prev) => ({
    //         ...prev,
    //         nombre: data.nombre,
    //         telefono: data.telefono,
    //         correo: data.correo,
    //         direccion: data.direccion,
    //         tipoCliente: data.tipoCliente,
    //       }));
    //       setMessages((prev) => ({
    //         ...prev,
    //         cedula: 'Cliente encontrado.',
    //       }));
    //     } else {
    //       setMessages((prev) => ({
    //         ...prev,
    //         cedula: 'No se encontraron datos para esta cédula.',
    //       }));
    //     }
    //   } catch (error) {
    //     setMessages((prev) => ({
    //       ...prev,
    //       cedula: 'Error al buscar la cédula.',
    //     }));
    //   }
    // }

    if (field === 'marca' && value) {
      fetchModelosByMarca(value);
    }
  };

  const handleUpdateTipoCedula = (label) => {
    let value;

    switch (label) {
      case 'Persona Física':
        value = 1;
        break;
      case 'Persona Jurídica':
        value = 2;
        break;
      case 'DIMEX':
        value = 3;
        break;
      case 'NITE':
        value = 4;
        break;
      default:
        value = null; // Manejo de error si el label no coincide
    }

    setAppointmentDetails((prev) => ({
      ...prev,
      tipoCedula: value, // Guarda el número correspondiente
    }));
  };

  const fetchModelosByMarca = async (marca) => {
    try {
      const response = await getModelosByMarca(marca);
      if (response.success) {
        const modelosLista = response.data.map((modelo) => modelo.MOD_NAME);

        setModelos(modelosLista);
      } else {
        setModelos([]);
      }
    } catch (error) {
      console.error('Error obteniendo modelos de vehículos:', error);
      setModelos([]);
    }
  };

  useEffect(() => {
    if (user?.EMP_CODE) {
      const fetchSucursales = async () => {
        try {
          const data = await getSucursales(user.EMP_CODE);
          const formattedOptions = data.map((s) => ({
            label: s.SUR_NAME,
            value: s.SUR_CODE,
          }));
          setSucursalOptions(formattedOptions);
          setSucursal(formattedOptions[0].value);
          setAppointmentDetails((prev) => ({
            ...prev,
            ['sucursal']: formattedOptions[0].value,
          }));
        } catch (error) {
          console.error('Error al cargar sucursales:', error);
        }
      };
      fetchSucursales();
      fetchModelosByMarca(marcas[0]);
    }
  }, [user]);

  const handleAppointmentSelect = (fecha, hora) => {
    handleUpdate('fecha', fecha);
    handleUpdate('hora', hora);
  };

  const handleBack = async () => {
    resetForm();
    navigation.navigate('Dashboard');
  };

  const handleNext = async () => {
    // Verifica que todos los campos de appointmentDetails estén llenos
    for (const key in appointmentDetails) {
      if (!appointmentDetails[key]) {
        setModalMessage(`El campo ${key} es obligatorio.`);
        setModalVisible(true);
        return;
      }
    }

    // Validación de cédula según el tipo de cédula seleccionado
    if (appointmentDetails.tipoCedula === 1) {
      if (!/^\d{9}$/.test(appointmentDetails.cedula)) {
        setModalMessage(
          'La cédula de Persona Física debe tener exactamente 9 dígitos numéricos.',
        );
        setModalVisible(true);
        return;
      }
    } else if (appointmentDetails.tipoCedula === 2) {
      if (!/^\d{10}$/.test(appointmentDetails.cedula)) {
        setModalMessage(
          'La cédula de Persona Jurídica debe tener exactamente 10 dígitos numéricos.',
        );
        setModalVisible(true);
        return;
      }
    } else if (appointmentDetails.tipoCedula > 2) {
      if (!/^\d{10}$/.test(appointmentDetails.cedula)) {
        setModalMessage(
          'La cédula debe tener exactamente 12 dígitos numéricos.',
        );
        setModalVisible(true);
        return;
      }
    }

    // Validación de teléfono (debe ser solo números y tener al menos 8 dígitos)
    if (!/^\d{8,}$/.test(appointmentDetails.telefono)) {
      setModalMessage(
        'El número de teléfono debe contener al menos 8 dígitos numéricos.',
      );
      setModalVisible(true);
      return;
    }

    // Validación de año del vehículo (debe ser un número válido entre 1900 y el año actual)
    const currentYear = new Date().getFullYear();
    if (
      !/^\d{4}$/.test(appointmentDetails.anio) ||
      appointmentDetails.anio < 1900 ||
      appointmentDetails.anio > currentYear
    ) {
      setModalMessage(
        `El año del vehículo debe ser un número entre 1900 y ${currentYear}`,
      );
      setModalVisible(true);
      return;
    }

    // Validación de nombre (debe contener solo letras y espacios)
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(appointmentDetails.nombre)) {
      setModalMessage('El nombre solo puede contener letras y espacios');
      setModalVisible(true);
      return;
    }

    // Validación de dirección
    if (appointmentDetails.direccion.length == 0) {
      setModalMessage('La dirección no puede estar vacía');
      setModalVisible(true);
      return;
    }

    // Validación de correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointmentDetails.correo)) {
      setModalMessage('El correo electrónico no es válido');
      setModalVisible(true);
      return;
    }

    // Obtener la fecha actual sin la hora (solo YYYY-MM-DD)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear las horas para comparar solo fechas

    const appointmentDate = new Date(appointmentDetails.fecha);

    // Validar si la fecha ingresada es menor a hoy
    if (appointmentDate < today) {
      setModalMessage(
        'La fecha de la cita no puede ser menor a la fecha actual.',
      );
      setModalVisible(true);
      return;
    }

    try {
      const citaActiva = await tieneCitaActiva(
        appointmentDetails.cedula,
        appointmentDetails.placa,
        '123', // Reemplaza esto con la API Key real
      );

      if (citaActiva) {
        resetForm();
        setModalMessage(
          'El cliente ya tiene una cita activa. No puede agendar otra.',
        );
        setModalVisible(true);
        return;
      }
    } catch (error) {
      setModalMessage('Error al verificar citas activas. Inténtalo de nuevo.');
      setModalVisible(true);
      return;
    }

    // Crear el objeto cliente
    const cliente = {
      TIPC_CODE: appointmentDetails.tipoCedula,
      CLI_CEDULAJURI: appointmentDetails.cedula,
      CLI_PHONE1: appointmentDetails.telefono,
      CLI_EMAIL: appointmentDetails.correo,
      CLI_NAME: appointmentDetails.nombre,
      CLI_DIRECCION1: appointmentDetails.direccion,
      TERMINOSYCONDICIONES: true,
    };

    // Crear el objeto vehiculo
    const vehiculo = {
      VEH_PLACA: appointmentDetails.placa,
      VEH_MARCA: appointmentDetails.marca,
      VEH_ESTILO: appointmentDetails.estilo,
      VEH_ANIO: appointmentDetails.anio,
    };

    function convertirHoraATimeSpan(hora12) {
      const [hora, minutoParte] = hora12.split(':');
      const minutos = minutoParte.slice(0, 2);
      const periodo = minutoParte.slice(3).toUpperCase();

      let horas24 = parseInt(hora, 10);
      if (periodo === 'PM' && horas24 !== 12) {
        horas24 += 12;
      } else if (periodo === 'AM' && horas24 === 12) {
        horas24 = 0;
      }

      return `${horas24.toString().padStart(2, '0')}:${minutos}:00`;
    }

    // Crear el objeto cita
    const cita = {
      CITCLIE_FECHA_RESERVA: appointmentDetails.fecha,
      CITCLIE_HORA: convertirHoraATimeSpan(appointmentDetails.hora),
      SUR_CODE: appointmentDetails.sucursal,
    };

    const citaRequestDTO = {
      Cliente: cliente,
      Cita: cita,
      Vehiculo: vehiculo,
    };

    try {
      const response = await crearCita(citaRequestDTO);

      // Mostrar mensaje en el modal según la respuesta del backend
      setModalMessage('La cita se agendó correctamente');
      setModalVisible(true);

      resetForm();
      // Si la cita se creó correctamente, redirigir al usuario
      if (response.resultado) {
        navigation.navigate('Dashboard');
      }
    } catch (error) {
      setModalMessage('Error al agendar la cita. Inténtalo de nuevo.');
      setModalVisible(true);
    }
  };

  const resetForm = () => {
    setAppointmentDetails({
      placa: '',
      marca: '',
      estilo: '',
      anio: '',
      cedula: '',
      nombre: '',
      telefono: '',
      correo: '',
      direccion: '',
      fecha: '',
      hora: '',
      tipoCedula: 1,
    });

    setModelos([]);
    setMessages({ placa: '', cedula: '' });
  };

  return (
    <View style={styles.container}>
      <Header title="Agendar Cita para Revisión" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            {/* Datos Vehículo */}
            <Text style={styles.sectionTitle}>Datos del Vehículo</Text>

            <View style={styles.row}>
              <View style={styles.fullWidth}>
                <CustomInput
                  label="Placa del Vehículo"
                  type="text"
                  value={appointmentDetails.placa}
                  onChange={(value) => handleUpdate('placa', value)}
                />
                {messages.placa ? <Text>{messages.placa}</Text> : null}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <CustomInput
                  label="Marca del Vehículo"
                  type="select"
                  options={marcas}
                  value={appointmentDetails.marca}
                  onChange={(value) => handleUpdate('marca', value)}
                />
              </View>
              <View style={styles.column}>
                <CustomInput
                  label="Modelo del Vehículo"
                  type="select"
                  value={appointmentDetails.estilo}
                  onChange={(value) => handleUpdate('estilo', value)}
                  options={modelos} // Pasamos la lista de modelos como opciones
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <CustomInput
                  label="Año del Vehículo"
                  type="number"
                  value={appointmentDetails.anio}
                  onChange={(value) => handleUpdate('anio', value)}
                />
              </View>
            </View>

            {/* Datos Personales */}
            <Text style={styles.sectionTitle}>Datos Personales</Text>

            <View style={styles.row}>
              <View style={styles.column}>
                <CustomInput
                  label="Tipo Cédula"
                  type="select"
                  options={[
                    'Persona Física',
                    'Persona Jurídica',
                    'DIMEX',
                    'NITE',
                  ]}
                  onChange={handleUpdateTipoCedula} // Llama a la función con el label seleccionado
                />
              </View>
              <View style={styles.column}>
                <CustomInput
                  label="Cédula"
                  type="text"
                  value={appointmentDetails.cedula}
                  onChange={(value) => handleUpdate('cedula', value)}
                />
                {messages.cedula ? <Text>{messages.cedula}</Text> : null}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <CustomInput
                  label="Nombre Completo"
                  type="text"
                  value={appointmentDetails.nombre}
                  onChange={(value) => handleUpdate('nombre', value)}
                />
              </View>
              <View style={styles.column}>
                <CustomInput
                  label="Número de Teléfono"
                  type="number"
                  value={appointmentDetails.telefono}
                  onChange={(value) => handleUpdate('telefono', value)}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <CustomInput
                  label="Correo"
                  type="text"
                  value={appointmentDetails.correo}
                  onChange={(value) => handleUpdate('correo', value)}
                />
              </View>
              <View style={styles.column}>
                <CustomInput
                  label="Dirección"
                  type="text"
                  value={appointmentDetails.direccion}
                  onChange={(value) => handleUpdate('direccion', value)}
                />
              </View>
            </View>

            <View style={styles.fullWidth}>
              <CustomInput
                label="Sucursal"
                type="select"
                options={[
                  'Seleccione',
                  ...sucursalOptions.map((option) => option.label),
                ]}
                value={
                  sucursalOptions.find((opt) => opt.value === sucursal)
                    ?.label || 'Seleccione'
                }
                onChange={(selectedLabel) => {
                  if (selectedLabel === 'Seleccione') {
                    setSucursal(-1);
                    handleUpdate('sucursal', null);
                    return;
                  }

                  const selectedOption = sucursalOptions.find(
                    (opt) => opt.label === selectedLabel,
                  );

                  setSucursal(selectedOption ? selectedOption.value : -1);
                  handleUpdate('sucursal', selectedOption);
                }}
              />
            </View>

            {/* Selección de Fecha */}
            <Text style={styles.sectionTitle}>Seleccione una Fecha</Text>
            <AppointmentScheduler
              onAppointmentSelect={(fecha, hora) =>
                handleAppointmentSelect(fecha, hora)
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <FooterButtons
        showDelete={false}
        onBack={handleBack}
        onNext={handleNext}
      />
      <GenericModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        caseType="Notificacion"
        message={modalMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#333' },
  flexContainer: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 10 },
  contentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  column: { width: '48%' },
  fullWidth: { width: '100%', marginBottom: 15 },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    marginRight: 10,
  },
  checkboxText: { fontSize: 14, color: '#333' },
  link: { color: '#007BFF', textDecorationLine: 'underline' },
});

export default ScheduleAppointmentScreen;
