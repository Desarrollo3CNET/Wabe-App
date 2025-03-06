import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTipoTrabajo } from '../../src/contexts/BoletaSlice'; // Acción para modificar tipoTrabajo en el slice
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import GenericModal from '../../src/components/recepcion/GenericModal';
import colors from '../../src/utils/colors';

const TipoTrabajoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const tipoTrabajos = useSelector((state) => state.boleta.tipoTrabajos);
  const [modalVisibleBoleta, setModalVisibleBoleta] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta');
  const [modalMessage, setModalMessage] = useState('');

  const handleSwitchChange = (selectedCode) => {
    // Actualizamos todos los tipos de trabajo
    const updatedTipoTrabajos = tipoTrabajos.map((tipo) => ({
      ...tipo,
      // Si el código del tipo de trabajo coincide con el seleccionado, setear isSelected en true, sino en false
      isSelected: tipo.TIPTRA_CODE === selectedCode,
    }));

    // Actualizar el estado global con el nuevo array de tipoTrabajos
    dispatch(setTipoTrabajo(updatedTipoTrabajos));
  };

  // Función para manejar el botón "Next" y validar si hay algún tipo de trabajo seleccionado
  const handleNext = () => {
    // Validación para asegurarse de que haya un tipo de trabajo con isSelected: true
    const selectedTipoTrabajo = tipoTrabajos.some((tipo) => tipo.isSelected);

    if (selectedTipoTrabajo) {
      navigation.navigate('PhotosAndVideosScreen', {
        fromScreen: 'TipoTrabajoScreen',
      });
    } else {
      setCaseType('Notificacion');
      setModalMessage(
        'Por favor, seleccione un tipo de trabajo antes de continuar.',
      );
      setModalVisibleBoleta(true);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Tipo de trabajo</Text>

          {tipoTrabajos.map((tipo) => (
            <View key={tipo.TIPTRA_CODE} style={styles.switchContainer}>
              <Text style={styles.switchLabel}>{tipo.TIPTRA_NOMBRE}</Text>
              <Switch
                style={styles.switch}
                value={tipo.isSelected} // Usamos isSelected del slice
                onValueChange={() => handleSwitchChange(tipo.TIPTRA_CODE)}
                trackColor={{ false: '#767577', true: '#767577' }} // Siempre gris
                thumbColor={tipo.isSelected ? colors.primary : '#f4f3f4'} // Amarillo cuando está encendido, gris claro cuando está apagado
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <FooterButtons
        onBack={() =>
          navigation.navigate('VehicleDetailsScreen', {
            fromScreen: 'TipoTrabajoScreen',
          })
        }
        onDelete={() => {
          setCaseType('CancelBoleta');
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
    padding: 10,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15, // Mantiene una distancia similar al resto de elementos
  },
  switchLabel: {
    fontSize: 18,
    color: '#333', // Color de texto similar a otros textos
    marginRight: 10, // Espaciado entre el texto y el Switch
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Mantén la transformación de escala que quieres
    marginLeft: 5, // Espaciado a la izquierda del switch para darle un poco de separación
    color: '#E0E0E0',
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default TipoTrabajoScreen;
