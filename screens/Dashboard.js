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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lista de citas</Text>
        <Image source={logo} style={styles.logo} />
      </View>

      {/* Fila de botones */}
      <View style={styles.buttonRow}>
        {/* Botón de rango de fechas */}
        <View style={styles.dateRangeContainer}>
          <DateRangeButton
            onRangeSelect={(startDate, endDate) =>
              console.log(`Rango seleccionado: ${startDate} - ${endDate}`)
            }
          />
        </View>

        {/* Botón de Filtrar */}
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#000" />
          <Text style={styles.filterText}>Filtrar</Text>
        </TouchableOpacity>

        {/* Botón de Crear Nueva Cita */}
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Crear nueva cita</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable List of Appointments */}
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
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  headerButton: {
    padding: 10,
    backgroundColor: '#FFD700',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dateRangeContainer: {
    flex: 1, // Ancho igual para todos los botones
    marginRight: 5, // Espaciado entre el rango de fechas y el botón de filtrar
  },
  filterButton: {
    flex: 1, // Ancho igual para todos los botones
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FFD700', // Fondo amarillo
    borderRadius: 10,
    marginHorizontal: 5, // Espaciado uniforme
  },
  filterText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  createButton: {
    flex: 1, // Ancho igual para todos los botones
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginLeft: 5, // Espaciado entre el botón de filtrar y "Crear nueva cita"
  },
  createButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  scrollview: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    paddingHorizontal: 10,
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
