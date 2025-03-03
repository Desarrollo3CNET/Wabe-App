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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import buttonIcon from '../../assets/buttonIcon.png';
import { setProperty, resetBoleta } from '../contexts/BoletaSlice';
import { setCreatingBoletaTrue } from '../contexts/AppSlice'; // Importar acción
import { addAccesorio } from '../contexts/BoletaSlice';
import { getAccesories } from '../services/AccesorioService';
import { processAccessories } from '../utils/processData/processAccessories';

const { width } = Dimensions.get('window');

const AppointmentCard = ({
  fecha,
  cliente,
  vehiculo,
  cita,
  showDateHeader,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  const [loading, setLoading] = useState(false);

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
      return time;
    }
  };

  const handleNavigate = async () => {
    setLoading(true);
    try {
      dispatch(resetBoleta());
      dispatch(setCreatingBoletaTrue());

      const rawAccessories = await getAccesories();
      const processedAccessories = await processAccessories(rawAccessories);

      processedAccessories.forEach((accessory) => {
        dispatch(addAccesorio(accessory));
      });

      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

      const InitializeBoleta = {
        CITCLIE_CODE: cita.CITCLIE_CODE,
        BOL_CODE: null,
        EMP_CODE: user.EMP_CODE,
        CLI_CODE: cliente.CLI_CODE,
        VEH_CODE: vehiculo.VEH_CODE,
        TIPTRA_CODE: null,
        BOL_FECHA: null,
        BOL_CLI_NOMBRE: cliente.CLI_NOMBRE,
        BOL_CLI_TELEFONO: cliente.CLI_TELEFONO,
        BOL_VEH_PLACA: vehiculo.VEH_PLACA,
        BOL_VEH_ANIO: vehiculo.VEH_ANIO.toString(),
        BOL_VEH_MARCA: vehiculo.VEH_MARCA,
        BOL_VEH_ESTILO: 'Sedán',
        BOL_VEH_MODELO: vehiculo.VEH_ESTILO,
        BOL_VEH_COLOR: vehiculo.VEH_COLOR,
        BOL_VEH_KM: null,
        BOL_VEH_COMBUSTIBLE: '1/4',
        BOL_CREATEDATE: null,
        BOL_UPDATEDATE: null,
        BOL_CREATEUSER: user.USU_USERNAME,
        BOL_UPDATEUSER: user.USU_USERNAME,
        BOL_FIRMA_CLIENTE: null,
        BOL_ESTADO: 0,
        BOL_UNWASHED: false,
        BOL_DELIVERED: false,
        BOL_CLI_CORREO: cliente.CLI_CORREO,
        CITCLI_CODE: cita.CITCLIE_CODE,
        BOL_FIRMA_CONSENTIMIENTO: null,
        BOL_ENTREGADOPOR: null,
        BOL_OBSERVACIONES: null,
        BOL_RECIBIDOPOR: null,
        BOL_RECIBIDOCONFORME: null,
        BOL_CAR_EXQUEMA: null,
        BOL_RECIBIDOPOR: user.USU_USERNAME,
        VEH_VEHICULO: vehiculo,
        LIST_IMAGES: [],
        paths: [],
        undonePaths: [],
        fechaIngreso: formattedDate,
        horaIngreso: formatTime(cita.CITCLIE_HORA),
      };

      Object.entries(InitializeBoleta).forEach(([key, value]) => {
        dispatch(setProperty({ key, value }));
      });

      navigation.navigate('VehicleDetailsScreen');
    } catch (error) {
      console.error('Error al manejar la navegación:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
      {/* Mostrar encabezado de fecha solo si está habilitado */}
      {showDateHeader && <Text style={styles.dateHeader}>{fecha}</Text>}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.userName}>{cliente.CLI_NOMBRE}</Text>
          <Text style={styles.info}>Número de Cita: {cita.CITCLIE_CODE}</Text>
          <Text style={styles.status}>
            Estado: {cita.ESTADO ? 'Activo' : 'Inactivo'}
          </Text>
          <Text style={styles.time}>Hora: {formatTime(cita.CITCLIE_HORA)}</Text>
          <Text style={styles.info}>Cédula: {cliente.CLI_CEDULA}</Text>
          <Text style={styles.info}>
            Vehículo: {vehiculo.VEH_MARCA} {vehiculo.VEH_ESTILO} -{' '}
            {vehiculo.VEH_ANIO}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.moreOptionsButton}
          onPress={handleNavigate}
        >
          <Image source={buttonIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
