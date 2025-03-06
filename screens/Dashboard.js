import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentCard from '../src/components/AppointmentCard';
import FilterModal from '../src/components/FilterModal';
import { getCitas } from '../src/services/CitaService';
import { processCitas } from '../src/utils/processData/processCitas';
import { clearCitas, addCita } from '../src/contexts/CitasSlice';
import { getDashboardData } from '../src/services/DashboardService';
import colors from '../src/utils/colors';

import eventEmitter from '../src/utils/eventEmitter';

const Dashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const citas = useSelector((state) => state.citas); // Estado global de citas
  const user = useSelector((state) => state.app.user); // Estado global del usuario
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState(null); // Datos del dashboard
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el spinner
  const [refreshing, setRefreshing] = useState(false); // Estado para refresh
  const logo = require('../assets/logo.png'); // Logo de la empresa
  const scrollViewRef = useRef(null);
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };
  const fetchCitas = async () => {
    setIsLoading(true);
    try {
      const dashboardResponse = await getDashboardData(user?.EMP_CODE);
      const rawCitas = await getCitas(-1, -1, -1);
      const processedCitas = processCitas(rawCitas);

      setDashboardData(dashboardResponse[0]);
      setFilteredCitas(processedCitas);
    } catch (error) {
      console.error('Error fetching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // eventEmitter.on('refresh', () => {
  //   fetchCitas();
  // });

  useEffect(() => {
    if (user?.EMP_CODE) {
      fetchCitas();
    }
  }, [user?.EMP_CODE]);

  // ✅ Hacer los cambios en Redux en otro efecto separado
  useEffect(() => {
    if (filteredCitas.length > 0) {
      dispatch(clearCitas());
      filteredCitas.forEach((cita) => dispatch(addCita(cita)));
    }
  }, [filteredCitas]); // ✅ Solo se ejecuta cuando `filteredCitas` cambia

  // Función para manejar búsqueda por número de cita
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = citas.filter((cita) =>
      cita.CITA.CITCLIE_CODE.toString().includes(query),
    );
    setFilteredCitas(filtered);
  };

  // Función para aplicar los filtros
  const handleApplyFilters = async (filters) => {
    const { startDate, endDate, estado, sucursal } = filters;

    let estadoParam = -1;
    if (estado === 'Activo') estadoParam = 1;
    if (estado === 'Finalizado') estadoParam = 0;

    setIsLoading(true);
    try {
      const rawCitas = await getCitas(estadoParam, -1, sucursal || -1);
      const processedCitas = processCitas(rawCitas);

      dispatch(clearCitas());
      processedCitas.forEach((cita) => {
        dispatch(addCita(cita));
      });

      // Filtramos las citas localmente sin restringir a la fecha de hoy
      const filtered = processedCitas.filter((cita) => {
        const citaDate = new Date(cita.CITA.CITCLIE_FECHA_RESERVA);
        return (
          (!startDate || citaDate >= new Date(startDate)) &&
          (!endDate || citaDate <= new Date(endDate))
        );
      });

      setFilteredCitas(filtered); // Se actualiza con todas las citas disponibles y no solo las de hoy
    } catch (error) {
      console.error('Error aplicando filtros y obteniendo citas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop}>
        <Ionicons name="arrow-up" size={25} color={colors.primary} />
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchCitas} />
        }
        ref={scrollViewRef}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.openDrawer()}
            >
              <Ionicons name="arrow-back" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Lista de citas</Text>
            <Image source={logo} style={styles.logo} />
          </View>

          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.userText}>Empresa: {user.EMP_NOMBRE}</Text>
              <Text style={styles.userText}>Empleado: {user.EMPL_NOMBRE}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerSection}>
          {/* Información del usuario */}

          {/* Dashboard Data */}
          {dashboardData && (
            <View style={styles.dashboardContainer}>
              <View style={[styles.card, styles.pendingCard]}>
                <Ionicons
                  name="clipboard-outline"
                  size={20}
                  color="#005EB8"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardNumber}>
                  {dashboardData.PENDIENTES}
                </Text>
                <Text style={styles.cardLabel}>Vehículos Pendientes</Text>
              </View>
              <View style={[styles.card, styles.receivedCard]}>
                <Ionicons
                  name="car-outline"
                  size={20}
                  color="#D32F2F"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardNumber}>{dashboardData.RECIBIDOS}</Text>
                <Text style={styles.cardLabel}>Vehículos Recibidos</Text>
              </View>
              <View style={[styles.card, styles.deliveredCard]}>
                <Ionicons
                  name="car-sport-outline"
                  size={20}
                  color="#FFA000"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardNumber}>
                  {dashboardData.ENTREGADOS}
                </Text>
                <Text style={styles.cardLabel}>Vehículos Entregados</Text>
              </View>
            </View>
          )}

          <View style={styles.buttonRow}>
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
              <Text style={styles.createButtonText}>+ Crear</Text>
            </TouchableOpacity>
          </View>

          {/* Barra de búsqueda */}
          <View style={styles.buttonRow}>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#999"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por número de cita..."
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>
          </View>
        </View>

        {/* Lista de citas o spinner */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.spinner}
          />
        ) : filteredCitas.length === 0 ? (
          <View style={styles.container}>
            <Text style={styles.noDataText}>
              No hay datos disponibles. Intenta con otros filtros.
            </Text>
          </View>
        ) : (
          <View style={styles.scrollviewContainer}>
            {/* Botón de volver al principio, siempre anclado */}
            <ScrollView style={styles.scrollview}>
              {Object.entries(
                filteredCitas.reduce((acc, cita) => {
                  const fecha = cita.CITA.CITCLIE_FECHA_RESERVA.split('T')[0];
                  if (!acc[fecha]) acc[fecha] = [];
                  acc[fecha].push(cita);
                  return acc;
                }, {}),
              ).map(([fecha, citasDelDia]) => (
                <View key={fecha}>
                  {/* Encabezado único por fecha */}
                  <Text style={styles.dateHeader}>{fecha}</Text>
                  {/* Renderizar las citas correspondientes a esa fecha */}
                  {citasDelDia.map((cita) =>
                    cita ? (
                      <AppointmentCard
                        key={cita.CITA.CITCLIE_CODE}
                        fecha={cita.CITA.CITCLIE_FECHA_RESERVA}
                        cliente={cita.CLIENTE}
                        vehiculo={cita.VEHICULO}
                        cita={cita.CITA}
                      />
                    ) : null,
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
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
    backgroundColor: '#333',
    padding: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  scrollviewContainer: {
    flex: 1,
    position: 'relative', // Asegura que los elementos dentro de este contenedor se posicionen en relación con él
  },
  userInfo: {
    alignItems: 'center',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  scrollToTopButton: {
    position: 'absolute', // Fija el botón en la pantalla
    bottom: 20, // Distancia desde la parte inferior
    right: 20, // Distancia desde la parte derecha
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Da un poco de sombra
    zIndex: 99999999999, // Asegura que esté encima del contenido
  },

  headerSection: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
  },
  noDataText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButton: {
    padding: 10,
    backgroundColor: colors.primary,
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
  userInfo: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  userText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },

  dashboardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    marginBottom: 15,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 10,
    borderWidth: 1,
  },
  pendingCard: {
    borderColor: colors.primary,
  },
  receivedCard: {
    borderColor: colors.primary,
  },
  deliveredCard: {
    borderColor: colors.primary,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 5,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 10,
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
    padding: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  filterText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 5,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  createButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  createButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  scrollview: {
    backgroundColor: '#333',
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    paddingHorizontal: 10,
  },
  spinner: {
    marginTop: 30,
  },
});

export default Dashboard;
