import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Header from '../../src/components/recepcion/Header';
import CustomInput from '../../src/components/recepcion/CustomInput';
import FooterButtons from '../../src/components/recepcion/FooterButtons';

const VehicleDetailsScreen = ({ navigation }) => {
  const [details, setDetails] = useState({
    placa: 'LKM-367',
    modelo: 'Suzuki',
    estilo: 'Vitara',
    anio: '2016',
    fechaIngreso: '25/05/2024',
    horaIngreso: '12:30 PM',
    combustible: '3/4',
  });

  const handleUpdate = (key, value) => {
    setDetails({ ...details, [key]: value });
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
                value={details.placa}
                onChange={(value) => handleUpdate('placa', value)}
              />
            </View>
            <View style={styles.column}>
              <CustomInput
                label="Modelo del Vehículo"
                type="text"
                value={details.modelo}
                onChange={(value) => handleUpdate('modelo', value)}
              />
            </View>
            <View style={styles.column}>
              <CustomInput
                label="Año del Vehículo"
                type="text"
                value={details.anio}
                onChange={(value) => handleUpdate('anio', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <CustomInput
                label="Estilo del Vehículo"
                type="text"
                value={details.estilo}
                onChange={(value) => handleUpdate('estilo', value)}
              />
            </View>
            <View style={styles.column}>
              <CustomInput
                label="Fecha de Ingreso"
                type="date"
                value={details.fechaIngreso}
                onChange={(value) => handleUpdate('fechaIngreso', value)}
              />
            </View>
            <View style={styles.column}>
              <CustomInput
                label="Hora de Ingreso"
                type="time"
                value={details.horaIngreso}
                onChange={(value) => handleUpdate('horaIngreso', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.column, styles.fullWidth]}>
              <CustomInput
                label="Combustible"
                type="select"
                value={details.combustible}
                options={['1/4', '1/3', '3/4', '1']}
                onChange={(value) => handleUpdate('combustible', value)}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <FooterButtons
        onBack={() => navigation.goBack()}
        onDelete={() => console.log('Eliminar Boleta')}
        onNext={() => navigation.navigate('FirmaScreen')}
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
  fullWidth: {
    flex: 3,
  },
});

export default VehicleDetailsScreen;
