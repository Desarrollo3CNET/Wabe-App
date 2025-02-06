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
  getSucursales,
  getByCedula,
  getByPlaca,
  getModelosByMarca,
} from '../src/services/CitaService';
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
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const user = useSelector((state) => state.app.user);
  const [sucursal, setSucursal] = useState(-1);
  const [sucursalOptions, setSucursalOptions] = useState([]);
  const [modelos, setModelos] = useState([]);
  // const handleUpdate = (key, value) => {
  //   setAppointmentDetails((prevState) => ({
  //     ...prevState,
  //     [key]: value,
  //   }));
  // };

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
            anio: data.anio,
            nombre: data.cliente.nombre,
            telefono: data.cliente.telefono,
            correo: data.cliente.correo,
            direccion: data.cliente.direccion,
            cedula: data.cliente.cedula,
            tipoCliente: data.cliente.tipoCliente,
          }));
          setMessages((prev) => ({
            ...prev,
            placa: 'Vehículo encontrado.',
          }));
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

    if (field === 'cedula' && value) {
      try {
        const data = await getByCedula(value);
        if (data) {
          setAppointmentDetails((prev) => ({
            ...prev,
            nombre: data.nombre,
            telefono: data.telefono,
            correo: data.correo,
            direccion: data.direccion,
            tipoCliente: data.tipoCliente,
          }));
          setMessages((prev) => ({
            ...prev,
            cedula: 'Cliente encontrado.',
          }));
        } else {
          setMessages((prev) => ({
            ...prev,
            cedula: 'No se encontraron datos para esta cédula.',
          }));
        }
      } catch (error) {
        setMessages((prev) => ({
          ...prev,
          cedula: 'Error al buscar la cédula.',
        }));
      }
    }

    if (field === 'marca' && value) {
      fetchModelosByMarca(value);
    }
  };

  const fetchModelosByMarca = async (marca) => {
    try {
      const response = await getModelosByMarca(marca);
      if (response.data.success) {
        const modelosLista = response.data.data.map(
          (modelo) => modelo.MOD_NAME,
        );
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
        } catch (error) {
          console.error('Error al cargar sucursales:', error);
        }
      };
      fetchSucursales();
    }
  }, [user]);

  const handleAppointmentSelect = (fecha, hora) => {
    handleUpdate('fecha', fecha);
    handleUpdate('hora', hora);
  };

  const handleNext = () => {
    if (!acceptTerms) {
      setModalMessage(
        'Debe aceptar los términos y condiciones para continuar.',
      );
      setModalVisible(true);
      return;
    }
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
                  value={appointmentDetails.tipoCedula}
                  onChange={(value) => handleUpdate('tipoCedula', value)}
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
                options={sucursalOptions.map((option) => option.label)}
                value={
                  sucursalOptions.find((opt) => opt.value === sucursal)
                    ?.label || ''
                }
                onChange={(selectedLabel) => {
                  const selectedOption = sucursalOptions.find(
                    (opt) => opt.label === selectedLabel,
                  );
                  setSucursal(selectedOption ? selectedOption.value : -1);
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

            {/* Checkbox de aceptación */}
            {/* <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <Text style={styles.checkbox}>{acceptTerms ? '✓' : ' '}</Text>
              <Text style={styles.checkboxText}>
                Acepto dar mi información y estoy de acuerdo con los{' '}
                <Text style={styles.link}>términos y condiciones</Text>.
              </Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <FooterButtons
        showDelete={false}
        onBack={() => navigation.navigate('Dashboard')}
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
