import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard from '../src/components/AppointmentCard';
import DateRangeButton from '../src/components/DateRangeButton';

const Dashboard = ({ navigation }) => {
  const [filteredCitas, setFilteredCitas] = useState([]);
  const logo = require('../assets/logo.png');

  const citas = [
    {
      fecha: '2024-09-10',
      citas: [
        {
          nombre: 'Nombre usuario',
          estado: 'Estado',
          hora: '09 AM - 10 AM',
          info: 'Información necesaria del vehículo',
        },
        {
          nombre: 'Nombre usuario',
          estado: 'En revisión',
          hora: '11 AM - 12 PM',
          info: 'Información necesaria del vehículo',
        },
      ],
    },
    {
      fecha: '2024-09-11',
      citas: [
        {
          nombre: 'Nombre usuario',
          estado: 'Entregado',
          hora: '8 AM - 9 AM',
          info: 'Información necesaria del vehículo',
        },
        {
          nombre: 'Nombre usuario',
          estado: 'Programada',
          hora: '11 AM - 12 PM',
          info: 'Información necesaria del vehículo',
        },
      ],
    },
  ];

  const handleDateRangeSelect = (startDate, endDate) => {
    const filtered = citas.filter((cita) => {
      const citaDate = new Date(cita.fecha);
      return citaDate >= startDate && citaDate <= endDate;
    });
    setFilteredCitas(filtered);
  };

  const groupByMonth = (data) => {
    const grouped = data.reduce((acc, cita) => {
      const month = new Date(cita.fecha).toLocaleDateString('es-ES', {
        month: 'long',
      });
      if (!acc[month]) acc[month] = [];
      acc[month].push(cita);
      return acc;
    }, {});
    return Object.entries(grouped);
  };

  const groupedCitas = groupByMonth(
    filteredCitas.length > 0 ? filteredCitas : citas,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Lista de citas</Text>
        <Image source={logo} style={styles.logo} />
      </View>

      <View style={styles.topButtons}>
        <DateRangeButton onRangeSelect={handleDateRangeSelect} />
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Crear nueva cita</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={20} color="black" />
          <Text style={styles.filterText}>Filtrar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollview}>
        {groupedCitas.map(([month, citas]) => (
          <View key={month} style={styles.monthSection}>
            <Text style={styles.monthHeader}>{month.toUpperCase()}</Text>
            {citas.map((cita, index) => (
              <View key={index} style={styles.daySection}>
                <Text style={styles.dayBullet}>
                  {new Date(cita.fecha).getDate()}
                </Text>
                <AppointmentCard fecha={cita.fecha} citas={cita.citas} />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollview: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
  },

  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  logoPlaceholder: {
    width: 30,
    height: 30,
    backgroundColor: '#ccc',
    borderRadius: 15,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  createButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  filterContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#666',
  },
  monthSection: {
    marginBottom: 20,
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  daySection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dayBullet: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 40,
    textAlign: 'center',
  },
});

export default Dashboard;
