import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../src/components/recepcion/Header';
import DateRangeButton from './../src/components/DateRangeButton';

const EntregaScreen = ({ navigation }) => {
  // Obtener las citas desde el slice de Redux
  const citasCompletadas = useSelector((state) => state.citasCompletadas);

  // Estados locales para filtros
  const [filteredData, setFilteredData] = useState(citasCompletadas);
  const [searchPlaca, setSearchPlaca] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Filtrar los datos
  const filterData = (text = searchPlaca, start = startDate, end = endDate) => {
    const filtered = citasCompletadas.filter((item) => {
      const itemDate = new Date(
        item.fechaIngreso.split(' ')[0].split('-').reverse().join('-'),
      );
      const isDateInRange =
        (!start || itemDate >= start) && (!end || itemDate <= end);
      const isPlacaMatch = !text || item.placa.includes(text.toUpperCase());

      return isDateInRange && isPlacaMatch;
    });

    setFilteredData(filtered);
  };

  // Manejar cambios en la búsqueda
  const handleSearchChange = (text) => {
    setSearchPlaca(text);
    filterData(text);
  };

  // Manejar selección de rango de fechas
  const handleDateRangeSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    filterData(searchPlaca, start, end);
  };

  // Manejar limpieza de filtros
  const handleClearFilters = () => {
    setSearchPlaca('');
    setStartDate(null);
    setEndDate(null);
    setFilteredData(citasCompletadas);
  };

  // Renderizar cada ítem
  const renderItem = ({ item }) => (
    <View style={styles.rowContainer}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.placa}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.cliente}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.fechaIngreso}</Text>
      </View>
      <View style={styles.cell}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('BoletaScreen', {
                fromScreen: 'EntregaScreen',
              })
            }
          >
            <Text style={styles.actionButtonText}>VER BOLETA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('ArticulosScreen', {
                fromScreen: 'EntregaScreen',
              })
            }
          >
            <Text style={styles.actionButtonText}>ARTÍCULOS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('PhotosAndVideosScreen', {
                fromScreen: 'EntregaScreen',
              })
            }
          >
            <Text style={styles.actionButtonText}>FOTOGRAFÍAS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log('Enviar correo')}
          >
            <Text style={styles.actionButtonText}>REENVIAR CORREO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Revisiones Completadas" />

      {/* Filtros */}
      <View style={styles.filters}>
        <DateRangeButton onRangeSelect={handleDateRangeSelect} />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por placa"
            placeholderTextColor="#AAA"
            value={searchPlaca}
            onChangeText={handleSearchChange}
          />
        </View>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearFilters}
        >
          <Text style={styles.clearButtonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      {/* Encabezado de tabla */}
      <View style={styles.tableHeader}>
        <View style={styles.cell}>
          <Text style={styles.tableHeaderText}>Placa</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.tableHeaderText}>Cliente</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.tableHeaderText}>Fecha Ingreso</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.tableHeaderText}>Acciones</Text>
        </View>
      </View>

      {/* Lista de registros */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  searchContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FF5252',
    borderRadius: 5,
    marginLeft: 5,
  },
  clearButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    paddingVertical: 10,
    marginBottom: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  list: {
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingVertical: 10,
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    textAlign: 'center',
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
});

export default EntregaScreen;
