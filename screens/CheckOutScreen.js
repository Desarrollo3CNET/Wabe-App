import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Header from '../src/components/recepcion/Header';
import DateRangeButton from './../src/components/DateRangeButton';
import {
  getBoletas,
  getBoletaById,
  generarOrdenTrabajo,
} from '../src/services/BoletaService'; // Importa la función para obtener boletas
import { getAccesoriesByBoleta } from '../src/services/AccesorioService'; // Importa la función para obtener boletas
import { ObtenerArticulosMantenimiento } from '../src/services/ArticulosService'; // Importa la función para obtener boletas
import { processArticulos } from '../src/utils/processData/processArticulos'; // Importa la función para obtener boletas

import { GetImagesBoleta } from '../src/services/BoletaService'; // Importa la función para obtener boletas
import GenericModal from '../src/components/recepcion/GenericModal'; // Importación del GenericModal

import { useDispatch, useSelector } from 'react-redux';
import {
  resetAllStates,
  setArticulosMantenimiento,
} from '../src/contexts/RevisionSlice';
import { setCreatingRevisionTrue } from '../src/contexts/AppSlice';
import {
  setBoletaData,
  addAccesorio,
  setImages,
  resetBoleta,
} from '../src/contexts/BoletaSlice';
import eventEmitter from '../src/utils/eventEmitter';

const CheckOutScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchPlaca, setSearchPlaca] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const user = useSelector((state) => state.app.user); // Estado global del usuario
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true); // Activa la animación de refresco
    setIsLoading(true);
    try {
      const boletas = await getBoletas(0, user.EMP_CODE);
      setData(boletas);
      setFilteredData(boletas);
    } catch (error) {
      console.error('Error al obtener boletas:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false); // Desactiva la animación de refresco
    }
  };

  // eventEmitter.on('refresh', () => {
  //   fetchData();
  // });

  useEffect(() => {
    fetchData();
  }, []);

  const filterData = (text = searchPlaca, start = startDate, end = endDate) => {
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.BOL_FECHA);

      // Verificar si la fecha está en rango
      const isDateInRange =
        (!start || itemDate >= start) && (!end || itemDate <= end);

      // Verificar si el texto coincide con la placa, nombre o código de la boleta
      const isTextMatch =
        !text ||
        item.BOL_VEH_PLACA.toUpperCase().includes(text.toUpperCase()) ||
        item.BOL_CLI_NOMBRE.toUpperCase().includes(text.toUpperCase()) ||
        item.BOL_CODE.toString().includes(text);

      // Retornar true solo si ambos filtros (rango de fecha y coincidencia de texto) son válidos
      return isDateInRange && isTextMatch;
    });

    setFilteredData(filtered);
  };

  const handleSearchChange = (text) => {
    setSearchPlaca(text);
    filterData(text);
  };

  const handleDateRangeSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    filterData(searchPlaca, start, end);
  };

  const handleNavigateToBoleta = async (item) => {
    setIsLoading(true); // Inicia el indicador de carga para boleta
    try {
      // Obtener la información detallada de la boleta usando su BOL_CODE
      const boletaDetails = await getBoletaById(item.BOL_CODE);

      if (boletaDetails) {
        // Actualizar el estado del slice de boleta con toda la información obtenida
        dispatch(setBoletaData(boletaDetails));
      }

      // Obtener los accesorios asociados a la boleta usando su BOL_CODE
      const accesorios = await getAccesoriesByBoleta(item.BOL_CODE);

      if (accesorios && accesorios.length > 0) {
        // Solo setear los nombres de los accesorios
        accesorios.forEach((accesorio) => {
          dispatch(
            addAccesorio({
              TIPACC_CODE: accesorio.TIPACC_CODE,
              TIPACC_NOMBRE: accesorio.TIPACC_NOMBRE,
            }),
          );
        });
      }

      // Navegar a la pantalla de BoletaScreen después de actualizar el estado
      navigation.navigate('BoletaScreen', {
        fromScreen: 'CheckOutScreen',
      });
    } catch (error) {
      console.error(
        'Error al obtener los detalles de la boleta o accesorios:',
        error,
      );
      setModalMessage(
        'Hubo un error al intentar redirigir a la pantalla de Boleta. Por favor, inténtalo de nuevo.',
      ); // Mensaje del modal
      setModalVisible(true);
    } finally {
      setIsLoading(false); // Detiene el indicador de carga para boleta
    }
  };

  const handleNavigateToPhotosAndVideos = async (item) => {
    setIsLoading(true);
    try {
      // Obtener detalles de la boleta
      const boletaDetails = await getBoletaById(item.BOL_CODE);

      if (boletaDetails) {
        // Actualizar el estado del slice de boleta con toda la información obtenida
        dispatch(setBoletaData(boletaDetails));
      }

      // Formatear la fecha al formato YYYY-MM-DD
      const formattedDate = new Date(item.BOL_FECHA)
        .toISOString()
        .split('T')[0];

      // Ejecutar GetImagesBoleta con los parámetros necesarios
      const images = await GetImagesBoleta(item.BOL_VEH_PLACA, formattedDate);

      if (Array.isArray(images) && images.length > 0) {
        // Realizamos el dispatch para guardar las imágenes en el slice
        dispatch(setImages(images));
      }

      navigation.navigate('PhotosAndVideosScreen', {
        fromScreen: 'CheckOutScreen',
      });
    } catch (error) {
      setModalMessage(
        'Hubo un error al intentar redirigir a la pantalla de Fotografías. Por favor, inténtalo de nuevo.',
      ); // Mensaje del modal
      setModalVisible(true);
    } finally {
      setIsLoading(false); // Detiene el indicador de carga para boleta
    }
  };

  const handleNavigateToRevision = async (item) => {
    setIsLoading(true);
    try {
      dispatch(resetAllStates());

      // Obtener detalles de la boleta
      const boletaDetails = await getBoletaById(item.BOL_CODE);

      if (boletaDetails) {
        dispatch(setBoletaData(boletaDetails));
      }

      // Obtener los artículos en mantenimiento
      const articulosMantenimiento = await ObtenerArticulosMantenimiento(
        user.EMP_CODE,
      );

      // Agregar la propiedad ESTADO a los artículos
      const articulosConEstado = processArticulos(articulosMantenimiento);
      // Guardar en Redux
      dispatch(setArticulosMantenimiento(articulosConEstado));

      dispatch(setCreatingRevisionTrue());
      navigation.navigate('SuspencionDelanteraScreen');
    } catch (error) {
      console.error('Error al iniciar la revisión:', error);
      setModalMessage(
        'Hubo un error al intentar redirigir a la pantalla de Revisión. Por favor, inténtalo de nuevo.',
      );
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateWorkOrder = async (item) => {
    setIsLoading(true); // Inicia el indicador de carga
    try {
      const response = await generarOrdenTrabajo(item.BOL_CODE);

      if (response) {
        // Mostrar mensaje de éxito en el modal
        setModalMessage('La orden de trabajo se generó exitosamente.');
        setModalVisible(true);
      } else {
        // Si no hay respuesta, mostrar un mensaje de advertencia
        setModalMessage(
          'No se pudo generar la orden de trabajo. Por favor, inténtalo de nuevo.',
        );
        setModalVisible(true);
      }
    } catch (error) {
      // Mostrar mensaje de error en el modal
      setModalMessage(
        'Hubo un error al intentar generar la orden de trabajo. Por favor, inténtalo de nuevo.',
      );
      setModalVisible(true);
    } finally {
      setIsLoading(false); // Detiene el indicador de carga
    }
  };

  const renderItem = ({ item }) => {
    const formattedDate = new Date(item.BOL_FECHA)
      .toISOString()
      .split('T')[0]
      .replace(/-/g, '/');

    return (
      <View style={styles.rowContainer}>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.BOL_VEH_PLACA}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.BOL_CLI_NOMBRE}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{formattedDate}</Text>
        </View>

        <View style={styles.cell}>
          <View style={styles.actionButtons}>
            {item.CITCLIE_TIPO_CITA === 2 ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleGenerateWorkOrder(item)}
              >
                <Text style={styles.actionButtonText}>
                  GENERAR ORDEN DE TRABAJO
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleNavigateToRevision(item)}
              >
                <Text style={styles.actionButtonText}>REVISIÓN MECÁNICA</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleNavigateToBoleta(item)}
            >
              <Text style={styles.actionButtonText}>BOLETA</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleNavigateToPhotosAndVideos(item)}
            >
              <Text style={styles.actionButtonText}>FOTOGRAFÍAS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Check Out" />
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
      >
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#FFD700"
            style={styles.spinner}
          />
        ) : (
          <>
            <View style={{ marginTop: 10 }}>
              <DateRangeButton onRangeSelect={handleDateRangeSelect} />
            </View>

            <View style={styles.filters}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por placa o cliente"
                placeholderTextColor="#AAA"
                value={searchPlaca}
                onChangeText={handleSearchChange}
              />
            </View>

            {filteredData.length === 0 ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  No hay datos disponibles. Intenta con otros filtros.
                </Text>
              </View>
            ) : (
              <>
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

                <FlatList
                  data={filteredData}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.BOL_CODE.toString()}
                  contentContainerStyle={styles.list}
                />
              </>
            )}
          </>
        )}
      </ScrollView>

      <GenericModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        caseType="Notificacion"
        message={modalMessage}
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  // clearButton: {
  //   flex: 1,
  //   paddingVertical: 8,
  //   paddingHorizontal: 12,
  //   backgroundColor: '#FF5252',
  //   borderRadius: 5,
  // },
  // clearButtonText: {
  //   color: '#FFF',
  //   fontWeight: 'bold',
  // },
  tableHeader: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFD700',
    marginTop: 15,
  },

  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  list: {
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginBottom: 6,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  cellText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    alignItems: 'center',
    margin: 2,
    minWidth: 80,
  },
  longActionButton: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    alignItems: 'center',
    margin: 2,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  spinner: {
    marginTop: 30,
  },
});

export default CheckOutScreen;
