import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import buttonIcon from '../../assets/buttonIcon.png';
import { getAccesories } from '../services/AccesorioService'; // Importa la función para obtener accesorios
import { processAccessories } from '../utils/processData/processAccessories'; // Importa la función para procesar accesorios
import { addAccesorio, updateVehicleDetail } from '../contexts/BoletaSlice'; // Importa la acción de Redux

const { width } = Dimensions.get('window');

const AppointmentCard = ({ fecha, citas }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false); // State to manage loading spinner visibility

  // Función para formatear la hora
  const formatTime = (time) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(hours, minutes);
      return new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return time; // En caso de error, devuelve el formato original
    }
  };

  const handleNavigate = async (cita) => {
    setLoading(true); // Show spinner
    try {
      // Dispatch each property of the vehiculo object
      const vehiculoData = {
        placa: cita.vehiculo.placa,
        modelo: cita.vehiculo.modelo || cita.vehiculo.estilo,
        estilo: cita.vehiculo.estilo,
        anio: cita.vehiculo.anio.toString(),
        fechaIngreso: cita.cita.fecha,
        horaIngreso: cita.cita.hora,
        combustible: '',
        kilometraje: '',
      };

      Object.entries(vehiculoData).forEach(([key, value]) => {
        dispatch(updateVehicleDetail({ key, value }));
      });

      // Fetch accessories, process, and add to Redux
      const rawAccessories = await getAccesories();
      const processedAccessories = processAccessories(rawAccessories);

      processedAccessories.forEach((accessory) => {
        dispatch(addAccesorio(accessory));
      });

      // Navigate to vehicle details screen
      navigation.navigate('VehicleDetailsScreen');
    } catch (error) {
      console.error('Error al manejar la navegación:', error);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <View style={styles.container}>
      {loading && ( // Show the overlay with spinner when loading
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
      <Text style={styles.dateHeader}>{fecha}</Text>
      {citas.map((cita, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.userName}>{cita.cliente.nombre}</Text>
            <Text style={styles.info}>Número de Cita: {cita.cita.idCita}</Text>
            <Text style={styles.status}>
              Estado: {cita.cita.estado ? 'Activo' : 'Inactivo'}
            </Text>
            <Text style={styles.time}>Hora: {formatTime(cita.cita.hora)}</Text>
            <Text style={styles.info}>Cédula: {cita.cliente.cedula}</Text>
            <Text style={styles.info}>
              Vehículo: {cita.vehiculo.marca} {cita.vehiculo.modelo} -{' '}
              {cita.vehiculo.anio}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.moreOptionsButton}
            onPress={() => handleNavigate(cita)} // Pass the cita as an argument
          >
            <Image source={buttonIcon} style={styles.icon} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: width * 0.9,
    alignSelf: 'center',
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  time: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  info: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  moreOptionsButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default AppointmentCard;
