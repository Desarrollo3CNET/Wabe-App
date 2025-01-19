import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import AppointmentCard from '../src/components/AppointmentCard';
import FilterModal from '../src/components/FilterModal';

const Dashboard = ({ navigation }) => {
  const citas = useSelector((state) => state.citas); // Obtén las citas desde el slice
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const logo = require('../assets/logo.png');

  useEffect(() => {
    // Inicializa el estado filtrado con todas las citas desde el slice
    setFilteredCitas(citas);
  }, [citas]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = citas
      .map((cita) => ({
        ...cita,
        citas: cita.citas.filter((c) => c.numero.includes(query)),
      }))
      .filter((cita) => cita.citas.length > 0);
    setFilteredCitas(filtered);
  };

  const handleApplyFilters = (filters) => {
    const { startDate, endDate, estado, sucursal } = filters;

    const filtered = citas.filter((cita) => {
      const citaDate = new Date(cita.fecha);
      const matchesDate =
        (!startDate || citaDate >= new Date(startDate)) &&
        (!endDate || citaDate <= new Date(endDate));
      const matchesEstado =
        estado === 'Todos' || cita.citas.some((c) => c.estado === estado);
      const matchesSucursal =
        !sucursal ||
        cita.citas.some(
          (c) => c.sucursal.toLowerCase() === sucursal.toLowerCase(),
        );

      return matchesDate && (matchesEstado || matchesSucursal);
    });

    setFilteredCitas(filtered);
  };

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
        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por número de cita"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Botón de Filtrar */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={20} color="#000" />
          <Text style={styles.filterText}>Filtrar</Text>
        </TouchableOpacity>

        {/* Botón de Crear Nueva Cita */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('ScheduleAppointmentScreen')}
        >
          <Text style={styles.createButtonText}>Crear nueva cita</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable List of Appointments */}
      <ScrollView style={styles.scrollview}>
        {filteredCitas.map((cita) => (
          <AppointmentCard
            key={cita.fecha}
            fecha={cita.fecha}
            citas={cita.citas}
          />
        ))}
      </ScrollView>

      {/* Modal de filtros */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleApplyFilters}
      />
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
    alignItems: 'center',
    marginTop: 10,
  },
  searchContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  filterText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  createButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginLeft: 5,
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
});

export default Dashboard;
