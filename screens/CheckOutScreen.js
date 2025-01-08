import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Header from '../src/components/recepcion/Header';

const CheckOutScreen = ({ navigation }) => {
  const data = [
    {
      id: '1',
      placa: 'B834620',
      cliente: 'SERVICIO DE VIAJEROS SUIZA',
      fechaIngreso: '22-11-2024 10:41 a. m.',
    },
    {
      id: '2',
      placa: 'B834620',
      cliente: 'SERVICIO DE VIAJEROS SUIZA',
      fechaIngreso: '21-11-2024 03:52 p. m.',
    },
  ];

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
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SuspensionReviewScreen')}
        >
          <Text style={styles.actionButtonText}>REVISIÓN MECÁNICA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('DeliveryScreen')}
        >
          <Text style={styles.actionButtonText}>VER BOLETA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('PhotosAndVideosScreen')}
        >
          <Text style={styles.actionButtonText}>FOTOGRAFÍAS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Header title="Check Out" />

      {/* Filtros */}
      <View style={styles.filters}>
        <TextInput
          style={styles.dateInput}
          placeholder="2024/10/22"
          placeholderTextColor="#000"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="2024/11/22"
          placeholderTextColor="#000"
        />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por placa"
            placeholderTextColor="#AAA"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Encabezado de tabla */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Placa</Text>
        <Text style={styles.tableHeaderText}>Cliente</Text>
        <Text style={styles.tableHeaderText}>Fecha Ingreso</Text>
        <Text style={styles.tableHeaderText}>Acciones</Text>
      </View>

      {/* Lista de registros */}
      <FlatList
        data={data}
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
  dateInput: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    backgroundColor: '#FFF',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  searchButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#1E88E5',
    borderRadius: 5,
    marginLeft: 5,
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#1E88E5',
    borderRadius: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  list: {
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-around',
  },
  actionButton: {
    padding: 5,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
});

export default CheckOutScreen;
