import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Header from '../src/components/recepcion/Header';
import DateRangeButton from './../src/components/DateRangeButton';
import {
  getBoletas,
  getBoletaById,
  reenviarCorreo,
} from '../src/services/BoletaService'; // Importa la función para obtener boletas
import { getAccesoriesByBoleta } from '../src/services/AccesorioService'; // Importa la función para obtener boletas
import { getArticulosByBoleta } from '../src/services/ArticulosService';
import { GetImages } from '../src/services/FotografiasService'; // Importa la función para obtener boletas
import GenericModal from '../src/components/recepcion/GenericModal'; // Importación del GenericModal

import { useDispatch, useSelector } from 'react-redux';
import {
  setBoletaData,
  addAccesorio,
  setImages,
} from '../src/contexts/BoletaSlice';

import { agregarArticuloBoleta } from '../src/contexts/RevisionSlice';

const EntregaScreen = ({ navigation }) => {
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Obtén los datos de getBoletas en lugar del slice de Redux
      const boletas = await getBoletas(1, user.EMP_CODE);
      setData(boletas); // Asigna los datos al estado local
      setFilteredData(boletas); // Asigna también los datos filtrados
    } catch (error) {
      console.error('Error al obtener boletas:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleClearFilters = () => {
    setSearchPlaca('');
    setStartDate(null);
    setEndDate(null);
    setFilteredData(data);
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
        fromScreen: 'EntregaScreen',
      });
    } catch (error) {
      console.error(
        'Error al obtener los detalles de la boleta o accesorios:',
        error,
      );
      setModalMessage(
        'Hubo un error al intentar redirigir a la pantalla de Boleta. Por favor, inténtalo de nuevo.',
      ); // Mensaje del modal
      setModalVisible(true); // Mostrar el modal
    } finally {
      setIsLoading(false); // Detener el indicador de carga
    }
  };

  const handleNavigateToArticulos = async (item) => {
    setIsLoading(true);
    try {
      // Llama a la función para obtener los artículos por BoletaId.
      const articulos = await getArticulosByBoleta(item.BOL_CODE);
      // Extrae las descripciones de los artículos y envíalos al slice.
      articulos.forEach((articulo) => {
        if (articulo.ART_DESCRIPCION) {
          dispatch(agregarArticuloBoleta({ nombre: articulo.ART_DESCRIPCION }));
        }
      });

      // Navega a la pantalla de artículos.
      navigation.navigate('ArticulosScreen', {
        fromScreen: 'EntregaScreen',
      });
    } catch (error) {
      console.error('Error al obtener los artículos:', error);
      setModalMessage(
        'Hubo un error al intentar redirigir a la pantalla de Artículos. Por favor, inténtalo de nuevo.',
      ); // Mensaje del modal
      setModalVisible(true); // Mostrar el modal
    } finally {
      setIsLoading(false); // Detener el indicador de carga
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

      // Ejecutar GetImages con los parámetros necesarios
      const images = await GetImages(item.BOL_VEH_PLACA, formattedDate);

      if (Array.isArray(images) && images.length > 0) {
        // Realizamos el dispatch para guardar las imágenes en el slice
        dispatch(setImages(images));

        navigation.navigate('PhotosAndVideosScreen', {
          fromScreen: 'EntregaScreen',
        });
      } else {
        console.warn('No se encontraron imágenes para este ítem.');
      }
    } catch (error) {
      console.error('Error al obtener o guardar imágenes:', error);
      setModalMessage(
        'Hubo un error al intentar redirigir a la pantalla de Fotografías. Por favor, inténtalo de nuevo.',
      ); // Mensaje del modal
      setModalVisible(true); // Mostrar el modal
    } finally {
      setIsLoading(false); // Detener el indicador de carga
    }
  };

  async function handleSendEmail(idBoleta) {
    setIsLoading(true);
    try {
      const response = await reenviarCorreo(idBoleta);
      setModalMessage('Correo reenviado exitosamente'); // Mensaje del modal
      setModalVisible(true); // Mostrar el modal
      return response; // Devuelve la respuesta en caso de que sea necesario manejarla
    } catch (error) {
      setModalMessage(
        `Error al intentar reenviar el correo: ${error.message}`, // Mensaje del modal
      );
      setModalVisible(true); // Mostrar el modal
      console.error('Error al intentar reenviar el correo:', error);
    } finally {
      setIsLoading(false); // Detiene el indicador de carga para boleta
    }
  }

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
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleNavigateToBoleta(item)}
            >
              <Text style={styles.actionButtonText}>BOLETA</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleNavigateToArticulos(item)}
            >
              <Text style={styles.actionButtonText}>ARTÍCULOS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleNavigateToPhotosAndVideos(item)}
            >
              <Text style={styles.actionButtonText}>FOTOGRAFÍAS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSendEmail}
            >
              <Text style={styles.actionButtonText}>REENVIAR CORREO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Revisiones Completadas" />
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FFD700"
          style={styles.spinner}
        />
      ) : (
        <>
          <View style={styles.filters}>
            <DateRangeButton onRangeSelect={handleDateRangeSelect} />
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por placa o cliente"
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

          {/* Verificar si filteredData está vacío */}
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
      <GenericModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        caseType="Notificacion"
        message={modalMessage} // Muestra el mensaje dinámico
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333', // Fondo blanco para destacar el mensaje
    borderRadius: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#555', // Gris suave para el texto
    textAlign: 'center',
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    paddingVertical: 6,
    marginBottom: 6,
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
    paddingVertical: 6,
    paddingHorizontal: 0, // Elimina padding horizontal
    marginBottom: 6,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2, // Reduce espacio horizontal
  },
  cellText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 14, // Aumenta tamaño de fuente
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
    minWidth: 80, // Asegura uniformidad de botones superiores
  },
  longActionButton: {
    flex: 1, // Hace que el botón ocupe todo el ancho restante
    paddingVertical: 6,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    alignItems: 'center',
    margin: 2,
  },
  actionButtonText: {
    fontSize: 12, // Aumenta tamaño de fuente
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  spinner: {
    marginTop: 30,
  },
});

export default EntregaScreen;
