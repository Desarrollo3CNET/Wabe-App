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

  const handleUpdate = (key, value) => {
    setAppointmentDetails((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleAppointmentSelect = (fecha, hora) => {
    handleUpdate('fecha', fecha);
    handleUpdate('hora', hora);
  };

  const handleNext = () => {
    if (!acceptTerms) {
      alert('Debe aceptar los términos y condiciones para continuar.');
      return;
    }

    console.log('Detalles de la cita:', appointmentDetails);
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
            {/* Datos del Vehículo */}
            <Text style={styles.title}>Datos del Vehículo</Text>
            <View style={styles.grid}>
              <View style={styles.cell}>
                <CustomInput
                  label="Placa del Vehículo"
                  type="text"
                  value={appointmentDetails.placa}
                  onChange={(value) => handleUpdate('placa', value)}
                />
              </View>
              <View style={styles.cell}>
                <CustomInput
                  label="Marca del Vehículo"
                  type="text"
                  value={appointmentDetails.marca}
                  onChange={(value) => handleUpdate('marca', value)}
                />
              </View>
              <View style={styles.cell}>
                <CustomInput
                  label="Estilo del Vehículo"
                  type="text"
                  value={appointmentDetails.estilo}
                  onChange={(value) => handleUpdate('estilo', value)}
                />
              </View>
              <View style={styles.cell}>
                <CustomInput
                  label="Año del Vehículo"
                  type="number"
                  value={appointmentDetails.anio}
                  onChange={(value) => handleUpdate('anio', value)}
                />
              </View>
            </View>

            {/* Datos Personales */}
            <Text style={styles.title}>Datos Personales</Text>
            <View style={styles.grid}>
              <View style={styles.cell}>
                <CustomInput
                  label="Cédula"
                  type="text"
                  value={appointmentDetails.cedula}
                  onChange={(value) => handleUpdate('cedula', value)}
                />
              </View>
              <View style={styles.cell}>
                <CustomInput
                  label="Nombre Completo"
                  type="text"
                  value={appointmentDetails.nombre}
                  onChange={(value) => handleUpdate('nombre', value)}
                />
              </View>
              <View style={styles.cell}>
                <CustomInput
                  label="Número de Teléfono"
                  type="number"
                  value={appointmentDetails.telefono}
                  onChange={(value) => handleUpdate('telefono', value)}
                />
              </View>
              <View style={styles.cell}>
                <CustomInput
                  label="Correo Electrónico"
                  type="text"
                  value={appointmentDetails.correo}
                  onChange={(value) => handleUpdate('correo', value)}
                />
              </View>
            </View>

            {/* Dirección y Sucursal */}
            <View style={styles.grid}>
              <View style={styles.fullWidthCell}>
                <CustomInput
                  label="Dirección"
                  type="text"
                  value={appointmentDetails.direccion}
                  onChange={(value) => handleUpdate('direccion', value)}
                />
              </View>
              <View style={styles.fullWidthCell}>
                <CustomInput
                  label="Sucursal"
                  type="select"
                  value={appointmentDetails.sucursal}
                  options={['SUR #1 Pavas', 'NORTE #2 Alajuela']}
                  onChange={(value) => handleUpdate('sucursal', value)}
                />
              </View>
            </View>

            {/* Selección de Fecha y Hora */}
            <Text style={styles.title}>Fecha y Hora de la Cita</Text>
            <AppointmentScheduler
              onAppointmentSelect={(fecha, hora) =>
                handleAppointmentSelect(fecha, hora)
              }
            />
            <Text style={styles.selectedText}>
              Fecha seleccionada:{' '}
              {appointmentDetails.fecha || 'No seleccionada'}
            </Text>
            <Text style={styles.selectedText}>
              Hora seleccionada: {appointmentDetails.hora || 'No seleccionada'}
            </Text>

            {/* Términos y Condiciones */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <Text style={styles.checkbox}>{acceptTerms ? '✓' : ' '}</Text>
              <Text style={styles.checkboxText}>
                Acepto dar mi información y estoy de acuerdo con los{' '}
                <Text style={styles.link}>términos y condiciones</Text>.
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Botones de navegación */}
      <FooterButtons
        showDelete={false}
        onBack={() => navigation.navigate('Dashboard')}
        onNext={handleNext}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  flexContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
  },
  contentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cell: {
    width: '48%',
    marginBottom: 15,
  },
  fullWidthCell: {
    width: '100%',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  selectedText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ScheduleAppointmentScreen;
