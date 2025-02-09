import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentCard from '../src/components/AppointmentCard';
import FilterModal from '../src/components/FilterModal';
import { getCitas } from '../src/services/DashboardService'; // Importa getCitas
import { processCitas } from '../src/utils/processData/processCitas'; // Importa processCitas
import { clearCitas, addCita } from '../src/contexts/CitasSlice'; // Importa directamente la acción addCita
import { getDashboardData } from '../src/services/DashboardService'; // Importación del nuevo servicio

const Dashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const citas = useSelector((state) => state.citas); // Estado global de citas
  const user = useSelector((state) => state.app.user); // Estado global del usuario
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState(null); // Datos del dashboard
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el spinner
  const logo = require('../assets/logo.png'); // Logo de la empresa

  // Efecto para cargar citas desde la API
  useEffect(() => {
    const fetchCitas = async () => {
      setIsLoading(true); // Mostrar el spinner mientras se cargan datos
      try {
        const dashboardResponse = await getDashboardData(user?.EMP_CODE);
        setDashboardData(dashboardResponse[0]);

        const rawCitas = await getCitas(-1, -1, -1); // Parámetros iniciales para getCitas
        const processedCitas = processCitas(rawCitas); // Procesa las citas con processCitas
        // Añade las citas procesadas al slice de Redux
        processedCitas.forEach(async (cita) => {
          dispatch(addCita(cita)); // Realiza un dispatch de addCita por cada elemento
        });
      } catch (error) {
        console.error('Error obteniendo citas:', error);
      } finally {
        setIsLoading(false); // Ocultar el spinner al finalizar
      }
    };

    fetchCitas(); // Llamar a la función fetchCitas al montar el componente
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    if (filteredCitas.length === 0) {
      // Solo aplica el filtro inicial si no hay filtros activos
      const filtered = citas.filter(
        (cita) => cita.CITA.CITCLIE_FECHA_RESERVA.split('T')[0] === today,
      );
      setFilteredCitas(filtered);
    }
  }, [citas]);

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

      <View style={styles.headerSection}>
        {/* Información del usuario */}
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userText}>Empresa: {user.EMP_NOMBRE}</Text>
            <Text style={styles.userText}>Empleado: {user.EMPL_NOMBRE}</Text>
          </View>
        )}

        {/* Dashboard Data */}
        {dashboardData && (
          <View style={styles.dashboardContainer}>
            <View style={[styles.card, styles.pendingCard]}>
              <Ionicons name="clipboard-outline" size={20} color="#005EB8" />
              <Text style={styles.cardNumber}>{dashboardData.PENDIENTES}</Text>
              <Text style={styles.cardLabel}>Vehículos Pendientes</Text>
            </View>
            <View style={[styles.card, styles.receivedCard]}>
              <Ionicons name="car-outline" size={20} color="#D32F2F" />
              <Text style={styles.cardNumber}>{dashboardData.RECIBIDOS}</Text>
              <Text style={styles.cardLabel}>Vehículos Recibidos</Text>
            </View>
            <View style={[styles.card, styles.deliveredCard]}>
              <Ionicons name="car-sport-outline" size={20} color="#FFA000" />
              <Text style={styles.cardNumber}>{dashboardData.ENTREGADOS}</Text>
              <Text style={styles.cardLabel}>Vehículos Entregados</Text>
            </View>
          </View>
        )}

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
      </View>

      {/* Lista de citas o spinner */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FFD700"
          style={styles.spinner}
        />
      ) : filteredCitas.length === 0 ? (
        <View style={styles.container}>
          <Text style={styles.noDataText}>
            No hay datos disponibles. Intenta con otros filtros.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollview}>
          {Object.entries(
            filteredCitas.reduce((acc, cita) => {
              const fecha = cita.CITA.CITCLIE_FECHA_RESERVA.split('T')[0]; // Solo la fecha (sin hora)
              if (!acc[fecha]) acc[fecha] = [];
              acc[fecha].push(cita);
              return acc;
            }, {}),
          ).map(([fecha, citasDelDia]) => (
            <View key={fecha}>
              {/* Encabezado único por fecha */}
              <Text style={styles.dateHeader}>{fecha}</Text>
              {/* Renderizar las citas correspondientes a esa fecha */}
              {citasDelDia.map((cita) => (
                <AppointmentCard
                  key={cita.CITA.CITCLIE_CODE}
                  fecha={cita.CITA.CITCLIE_FECHA_RESERVA}
                  cliente={cita.CLIENTE}
                  vehiculo={cita.VEHICULO}
                  cita={cita.CITA}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}

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
  headerSection: {
    backgroundColor: '#333',
  },
  noDataText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Para Android
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
  userInfo: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Para Android
  },
  userText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2,
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
    color: '#333',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    borderRadius: 8,
    marginHorizontal: 10,
    borderWidth: 2,
  },
  pendingCard: {
    borderColor: '#FFD700',
  },
  receivedCard: {
    borderColor: '#FFD700',
  },
  deliveredCard: {
    borderColor: '#FFD700',
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 5,
  },
  cardLabel: {
    fontSize: 12,
    color: '#FFD700',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Para Android
    borderRadius: 10,
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
    padding: 8,
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
    padding: 8,
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
