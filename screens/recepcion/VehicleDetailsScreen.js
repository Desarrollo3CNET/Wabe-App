import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateVehicleDetail } from '../../src/contexts/BoletaSlice';
import Header from '../../src/components/recepcion/Header';
import CustomInput from '../../src/components/CustomInput';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import CancelBoletaModal from '../../src/components/recepcion/CancelBoletaModal';

const VehicleDetailsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const vehiculo = useSelector((state) => state.boleta.vehicleDetails); // Ajuste aquí
  const [modalVisibleBoleta, setmodalVisibleBoleta] = useState(false);

  const handleUpdate = (key, value) => {
    dispatch(updateVehicleDetail({ key, value }));
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
                value={vehiculo.placa} // Ajuste aquí
                onChange={(value) => handleUpdate('placa', value)}
              />
            </View>
            <View style={styles.column}>
              <CustomInput
                label="Estilo del Vehículo"
                type="text"
                value={vehiculo.estilo} // Ajuste aquí
                onChange={(value) => handleUpdate('estilo', value)}
              />
            </View>
            <View style={styles.column}>
              <CustomInput
                label="Año del Vehículo"
                type="number"
                value={vehiculo.anio} // Ajuste aquí
                onChange={(value) => handleUpdate('anio', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <CustomInput
                label="Kilometraje"
                type="number"
                value={vehiculo.kilometraje} // Ajuste aquí
                onChange={(value) => handleUpdate('kilometraje', value)}
              />
            </View>
            <View style={styles.column}>
              <CustomInput
                label="Hora de Ingreso"
                type="time"
                value={vehiculo.horaIngreso} // Ajuste aquí
                onChange={(value) => handleUpdate('horaIngreso', value)}
              />
            </View>
            <View style={styles.column}>
              <CustomInput
                label="Fecha de Ingreso"
                type="date"
                value={vehiculo.fechaIngreso} // Ajuste aquí
                onChange={(value) => handleUpdate('fechaIngreso', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <CustomInput
                label="Combustible"
                type="select"
                value={vehiculo.combustible} // Ajuste aquí
                options={['1/4', '1/3', '3/4', '1']}
                onChange={(value) => handleUpdate('combustible', value)}
              />
            </View>

            <View style={styles.column}></View>
          </View>
        </View>
      </ScrollView>

      <FooterButtons
        onBack={() => setmodalVisibleBoleta(true)}
        onDelete={() => setmodalVisibleBoleta(true)}
        onNext={() =>
          navigation.navigate('FirmaScreen', {
            fromScreen: 'VehicleDetailsScreen',
          })
        }
      />

      {/* CancelBoletaModal */}
      <CancelBoletaModal
        visible={modalVisibleBoleta}
        onClose={() => setmodalVisibleBoleta(false)}
        navigation={navigation}
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
