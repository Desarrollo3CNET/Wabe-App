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
import { getBoletas, getBoletaById } from '../src/services/BoletaService'; // Importa la función para obtener boletas
import { getAccesoriesByBoleta } from '../src/services/AccesorioService'; // Importa la función para obtener boletas
import { GetImages } from '../src/services/FotografiasService'; // Importa la función para obtener boletas

import { useDispatch, useSelector } from 'react-redux';
import {
  setObservaciones,
  setNombre,
  setFirma,
  updateVehicleDetail,
  addAccesorio,
  setAttachments,
  setEsquema,
} from '../src/contexts/BoletaSlice';

const CheckOutScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchPlaca, setSearchPlaca] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.app.user); // Estado global del usuario

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Obtén los datos de getBoletas en lugar del slice de Redux
      const boletas = await getBoletas(0, user.EMP_CODE);
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
      console.log(boletaDetails);

      if (boletaDetails) {
        // Actualizar el estado del slice de boleta con la información obtenida
        dispatch(
          updateVehicleDetail({
            key: 'placa',
            value: boletaDetails.BOL_VEH_PLACA,
          }),
        );
        dispatch(
          updateVehicleDetail({
            key: 'modelo',
            value: boletaDetails.BOL_VEH_MARCA,
          }),
        );
        dispatch(
          updateVehicleDetail({
            key: 'estilo',
            value: boletaDetails.BOL_VEH_ESTILO,
          }),
        );
        dispatch(
          updateVehicleDetail({
            key: 'anio',
            value: boletaDetails.BOL_VEH_COLOR,
          }),
        );
        dispatch(
          updateVehicleDetail({
            key: 'combustible',
            value: boletaDetails.BOL_VEH_COMBUSTIBLE,
          }),
        );
        dispatch(
          updateVehicleDetail({
            key: 'kilometraje',
            value: boletaDetails.BOL_VEH_KM,
          }),
        );
        dispatch(
          updateVehicleDetail({
            key: 'telefono',
            value: boletaDetails.BOL_CLI_TELEFONO,
          }),
        );
        dispatch(
          updateVehicleDetail({
            key: 'fechaIngreso',
            value: boletaDetails.BOL_FECHA,
          }),
        );
        dispatch(
          updateVehicleDetail({
            key: 'horaIngreso',
            value: boletaDetails.BOL_FECHA.split('T')[1],
          }),
        );

        dispatch(setObservaciones(boletaDetails.BOL_OBSERVACIONES));
        dispatch(setNombre(boletaDetails.BOL_CLI_NOMBRE));

        if (boletaDetails.BOL_FIRMA_CLIENTE) {
          dispatch(setFirma(boletaDetails.BOL_FIRMA_CLIENTE));
        }
      }

      // Obtener los accesorios asociados a la boleta usando su BOL_CODE
      const accesorios = await getAccesoriesByBoleta(item.BOL_CODE);

      if (accesorios && accesorios.length > 0) {
        // Solo setear los nombres de los accesorios
        accesorios.forEach((accesorio) => {
          dispatch(
            addAccesorio({
              id: accesorio.TIPACC_CODE,
              nombre: accesorio.TIPACC_NOMBRE,
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
    } finally {
      setIsLoading(false); // Detiene el indicador de carga para boleta
    }
  };

  const handleNavigateToPhotosAndVideos = async (item) => {
    setIsLoading(true);
    try {
      // Obtener detalles de la boleta
      const boletaDetails = await getBoletaById(item.BOL_CODE);

      if (boletaDetails && boletaDetails.BOL_CAR_EXQUEMA) {
        // Actualizar el estado del slice con el esquema en base64
        dispatch(setEsquema(boletaDetails.BOL_CAR_EXQUEMA));
      }

      // Formatear la fecha al formato YYYY-MM-DD
      const formattedDate = new Date(item.BOL_FECHA)
        .toISOString()
        .split('T')[0];

      // Ejecutar GetImages con los parámetros necesarios
      const images = await GetImages(item.BOL_VEH_PLACA, formattedDate);

      if (Array.isArray(images) && images.length > 0) {
        // Realizamos el dispatch para guardar las imágenes en el slice
        dispatch(
          setAttachments({
            items: images, // Guardamos las imágenes en base64 directamente en el estado global
          }),
        );

        navigation.navigate('PhotosAndVideosScreen', {
          fromScreen: 'CheckOutScreen',
        });
      } else {
        console.warn('No se encontraron imágenes para este ítem.');
      }
    } catch (error) {
      console.error('Error al obtener o guardar imágenes:', error);
    } finally {
      setIsLoading(false); // Detiene el indicador de carga para boleta
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
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate('BoletaScreen', {
                  fromScreen: 'CheckOutScreen',
                })
              }
            >
              <Text style={styles.actionButtonText}>REVISIÓN MECÁNICA</Text>
            </TouchableOpacity>

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

export default CheckOutScreen;
