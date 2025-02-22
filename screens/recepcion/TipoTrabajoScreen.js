import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setProperty } from '../../src/contexts/BoletaSlice';
import { listTipoTrabajo } from '../../src/services/TipoTrabajoService';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import GenericModal from '../../src/components/recepcion/GenericModal';

const TipoTrabajoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const boleta = useSelector((state) => state.boleta);
  const [tipoTrabajos, setTipoTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisibleBoleta, setModalVisibleBoleta] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchTipoTrabajo = async () => {
      try {
        const response = await listTipoTrabajo();
        setTipoTrabajos(response);
      } catch (error) {
        console.error('Error obteniendo tipos de trabajo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTipoTrabajo();
  }, []);

  const handleUpdate = (key, value) => {
    dispatch(setProperty({ key, value }));
  };

  const handleSwitchChange = (selectedCode) => {
    if (boleta.TIPTRA_CODE === selectedCode) {
      handleUpdate('TIPTRA_CODE', null); // Apagar el switch si ya está encendido
    } else {
      handleUpdate('TIPTRA_CODE', selectedCode); // Encender el nuevo switch y apagar los demás
    }
  };

  const handleNext = async () => {
    if (boleta.TIPTRA_CODE) {
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

          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            tipoTrabajos.map((tipo) => (
              <View key={tipo.TIPTRA_CODE} style={styles.switchContainer}>
                <Text style={styles.switchLabel}>{tipo.TIPTRA_NOMBRE}</Text>
                <Switch
                  style={styles.switch}
                  value={boleta.TIPTRA_CODE === tipo.TIPTRA_CODE}
                  onValueChange={() => handleSwitchChange(tipo.TIPTRA_CODE)}
                  trackColor={{ false: '#767577', true: '#767577' }} // Siempre gris
                  thumbColor={
                    boleta.TIPTRA_CODE === tipo.TIPTRA_CODE
                      ? '#FFD700'
                      : '#f4f3f4'
                  } // Amarillo cuando está encendido, gris claro cuando está apagado
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <FooterButtons
        onBack={() =>
          navigation.navigate('FirmaScreen', {
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
