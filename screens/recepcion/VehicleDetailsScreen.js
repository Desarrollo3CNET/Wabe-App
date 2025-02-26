import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setProperty } from '../../src/contexts/BoletaSlice';
import Header from '../../src/components/recepcion/Header';
import CustomInput from '../../src/components/CustomInput';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import GenericModal from '../../src/components/recepcion/GenericModal';

const VehicleDetailsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const boleta = useSelector((state) => state.boleta);
  const [modalVisibleBoleta, setModalVisibleBoleta] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta');
  const [modalMessage, setModalMessage] = useState('');

  const handleUpdate = (key, value) => {
    dispatch(setProperty({ key, value }));
  };

  const handleNext = async () => {
    const requiredFields = [
      'BOL_VEH_PLACA',
      'BOL_VEH_ESTILO',
      'BOL_VEH_ANIO',
      'BOL_VEH_KM',
      'horaIngreso',
      'fechaIngreso',
      'BOL_VEH_COMBUSTIBLE',
    ];

    // Verificar si hay campos vacíos
    const missingFields = requiredFields.filter((field) => !boleta[field]);

    if (missingFields.length > 0) {
      setCaseType('Notificacion');
      setModalMessage(
        'Por favor, complete todos los campos antes de continuar.',
      );
      setModalVisibleBoleta(true);
      return;
    }

    // Validar que BOL_VEH_PLACA no tenga más de 10 caracteres y sea alfanumérico
    if (!/^[A-Za-z0-9]{1,10}$/.test(boleta.BOL_VEH_PLACA)) {
      setCaseType('Notificacion');
      setModalMessage(
        'La placa del vehículo no debe tener más de 10 caracteres.',
      );
      setModalVisibleBoleta(true);
      return;
    }

    // Validar que BOL_VEH_ANIO tenga 4 dígitos y esté entre 1900 y el año actual
    const currentYear = new Date().getFullYear();
    if (
      !/^\d{4}$/.test(boleta.BOL_VEH_ANIO) ||
      boleta.BOL_VEH_ANIO < 1900 ||
      boleta.BOL_VEH_ANIO > currentYear
    ) {
      setCaseType('Notificacion');
      setModalMessage(
        `El año del vehículo debe tener 4 dígitos y estar entre 1900 y ${currentYear}.`,
      );
      setModalVisibleBoleta(true);
      return;
    }

    // Validar que BOL_VEH_ESTILO tenga un máximo de 50 caracteres
    if (boleta.BOL_VEH_ESTILO.length > 50) {
      setCaseType('Notificacion');
      setModalMessage(
        'El estilo del vehículo no puede superar los 50 caracteres.',
      );
      setModalVisibleBoleta(true);
      return;
    }

    // Validar que BOL_VEH_KM sea un número entero y tenga menos de 10 dígitos
    if (!/^\d{1,9}$/.test(boleta.BOL_VEH_KM)) {
      setCaseType('Notificacion');
      setModalMessage(
        'El kilometraje debe ser un número entero de hasta 9 dígitos.',
      );
      setModalVisibleBoleta(true);
      return;
    }

    // Validar que fechaIngreso no sea anterior a la fecha actual
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Eliminar horas para comparación

    const [year, month, day] = boleta.fechaIngreso.split('/').map(Number);
    const fechaIngreso = new Date(year, month - 1, day); // Mes en base 0

    if (fechaIngreso < today) {
      setCaseType('Notificacion');
      setModalMessage(
        'La fecha de ingreso no puede ser anterior a la fecha actual.',
      );
      setModalVisibleBoleta(true);
      return;
    }

    // Si pasa todas las validaciones, navegar a la siguiente pantalla
    navigation.navigate('TipoTrabajoScreen', {
      fromScreen: 'VehicleDetailsScreen',
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Información del Vehículo</Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <CustomInput
                label="Placa del Vehículo"
                type="text"
                value={boleta.BOL_VEH_PLACA}
                onChange={(value) => handleUpdate('BOL_VEH_PLACA', value)}
              />
            </View>
            <View style={styles.column}>
              <CustomInput
                label="Estilo del Vehículo"
                type="text"
                value={boleta.BOL_VEH_ESTILO}
                onChange={(value) => handleUpdate('BOL_VEH_ESTILO', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <CustomInput
                label="Año del Vehículo"
                type="number"
                value={boleta.BOL_VEH_ANIO}
                onChange={(value) => handleUpdate('BOL_VEH_ANIO', value)}
              />
            </View>
            <View style={styles.column}>
              <CustomInput
                label="Kilometraje"
                type="number"
                value={boleta.BOL_VEH_KM}
                onChange={(value) => handleUpdate('BOL_VEH_KM', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <CustomInput
                label="Hora de Ingreso"
                type="time"
                value={boleta.horaIngreso}
                onChange={(value) => handleUpdate('horaIngreso', value)}
              />
            </View>
            <View style={styles.column}>
              <CustomInput
                label="Fecha de Ingreso"
                type="date"
                value={boleta.fechaIngreso}
                onChange={(value) => handleUpdate('fechaIngreso', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <CustomInput
                label="Combustible"
                type="select"
                value={boleta.BOL_VEH_COMBUSTIBLE}
                options={['1/4', '1/3', '3/4', '1']}
                onChange={(value) => handleUpdate('BOL_VEH_COMBUSTIBLE', value)}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <FooterButtons
        onBack={() => {
          setCaseType('CancelBoleta'); // Por defecto, es para cancelar la boleta
          setModalVisibleBoleta(true);
        }}
        onDelete={() => {
          setCaseType('CancelBoleta'); // Por defecto, es para cancelar la boleta
          setModalVisibleBoleta(true);
        }}
        onNext={handleNext}
      />

      <GenericModal
        visible={modalVisibleBoleta}
        onClose={() => setModalVisibleBoleta(false)}
        navigation={navigation}
        caseType={caseType}
        message={modalMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
  },
  contentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default VehicleDetailsScreen;
