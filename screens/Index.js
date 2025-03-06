import React, { useEffect } from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setLoggedIn, setEmpresa, setIsTablet } from '../src/contexts/AppSlice';
import { addAccesorio, setTipoTrabajo } from '../src/contexts/BoletaSlice';
import { setArticulosMantenimiento } from '../src/contexts/RevisionSlice';
import { ReadEmpresa } from '../src/services/EmpresaService';
import { getAccesories } from '../src/services/AccesorioService';
import { listTipoTrabajo } from '../src/services/TipoTrabajoService';
import { processAccessories } from '../src/utils/processData/processAccessories';
import { ObtenerArticulosMantenimiento } from '../src/services/ArticulosService';
import { processArticulos } from '../src/utils/processData/processArticulos';
import * as ScreenOrientation from 'expo-screen-orientation';

const Index = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { width } = Dimensions.get('window');
  const isTablet = width > 600;

  // Carga de datos de empresa, accesorios, artículos y tipos de trabajo
  useEffect(() => {
    const loadData = async () => {
      try {
        if (isTablet) {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE,
          );
          dispatch(setIsTablet(true));
        } else {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT,
          );
          dispatch(setIsTablet(false));
        }

        const rawAccessories = await getAccesories();
        const processedAccessories = await processAccessories(rawAccessories);

        const articulosMantenimiento = await ObtenerArticulosMantenimiento();
        const articulosConEstado = await processArticulos(
          articulosMantenimiento,
        );

        const empresa = await ReadEmpresa(6);
        const tipoTrabajos = await listTipoTrabajo();
        const tipoTrabajosConIsSelected = tipoTrabajos.map((tipo) => ({
          ...tipo,
          isSelected: false,
        }));

        // Esperar a que todas las acciones de Redux sean despachadas
        await Promise.all([
          ...processedAccessories.map((accessory) =>
            dispatch(addAccesorio(accessory)),
          ),
          dispatch(setArticulosMantenimiento(articulosConEstado)),
          dispatch(setEmpresa(empresa)),
          dispatch(setTipoTrabajo(tipoTrabajosConIsSelected)),
        ]);

        console.log(
          'Todos los datos han sido cargados y despachados correctamente.',
        );
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    const checkSession = async () => {
      try {
        const session = await AsyncStorage.getItem('session');
        if (session) {
          const sessionObj = JSON.parse(session);
          if (sessionObj && Object.keys(sessionObj).length > 0) {
            dispatch(setLoggedIn(sessionObj));
            navigation.replace('Dashboard');
          } else {
            navigation.replace('Login');
          }
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error al recuperar la sesión:', error);
        navigation.replace('Login');
      }
    };
    loadData();
    checkSession();
  }, [dispatch]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <View style={{ flex: 1, alignItems: 'center', paddingVertical: 20 }}>
        <Text>Index</Text>
      </View>
    </ScrollView>
  );
};

export default Index;
