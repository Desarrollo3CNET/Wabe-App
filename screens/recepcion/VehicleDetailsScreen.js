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
    if (
      boleta.BOL_VEH_PLACA &&
      boleta.BOL_VEH_ESTILO &&
      boleta.BOL_VEH_ANIO &&
      boleta.BOL_VEH_KM &&
      boleta.horaIngreso &&
      boleta.fechaIngreso &&
      boleta.BOL_VEH_COMBUSTIBLE
    ) {
      navigation.navigate('FirmaScreen', {
        fromScreen: 'VehicleDetailsScreen',
      });
    } else {
      setCaseType('Notificacion');
      setModalMessage(
        'Por favor, complete todos los campos antes de continuar.',
      );
      setModalVisibleBoleta(true);
    }
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
            <View style={styles.column}>
              <CustomInput
                label="Año del Vehículo"
                type="number"
                value={boleta.BOL_VEH_ANIO}
                onChange={(value) => handleUpdate('BOL_VEH_ANIO', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <CustomInput
                label="Kilometraje"
                type="number"
                value={boleta.BOL_VEH_KM}
                onChange={(value) => handleUpdate('BOL_VEH_KM', value)}
              />
            </View>
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
            <View style={styles.column}></View>
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
