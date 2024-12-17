import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import buttonIcon from '../../assets/buttonIcon.png';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AppointmentCard = ({ fecha, citas }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.dateHeader}>{fecha}</Text>
      {citas.map((cita, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.userName}>{cita.nombre}</Text>
            <Text style={styles.status}>{cita.estado}</Text>
            <Text style={styles.time}>{cita.hora}</Text>
            <Text style={styles.info}>{cita.info}</Text>
          </View>
          <TouchableOpacity
            style={styles.moreOptionsButton}
            onPress={() => navigation.navigate('VehicleDetailsScreen')}
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
