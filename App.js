import React, { useEffect } from 'react';
import { View, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import store from './src/contexts/Store';
import * as ScreenOrientation from 'expo-screen-orientation';

//Pantallas generales
import Login from './screens/Login';
import Index from './screens/Index';
import Dashboard from './screens/Dashboard';
import CheckOutScreen from './screens/CheckOutScreen';
import EntregaScreen from './screens/EntregaScreen';
import ScheduleAppointmentScreen from './screens/ScheduleAppointmentScreen';

//Pantallas de Boleta
import VehicleDetailsScreen from './screens/recepcion/VehicleDetailsScreen';
import FirmaScreen from './screens/recepcion/FirmaScreen';
import TipoTrabajoScreen from './screens/recepcion/TipoTrabajoScreen';
import PhotosAndVideosScreen from './screens/recepcion/PhotosAndVideosScreen';
import AccesoriosScreen from './screens/recepcion/AccesoriosScreen';

//Pantallas de Revisión
import DireccionScreen from './screens/revision/DireccionScreen';
import FrenosDelanterosScreen from './screens/revision/FrenosDelanterosScreen';
import FrenosTraserosScreen from './screens/revision/FrenosTraserosScreen';
import RodamientosDelanterosScreen from './screens/revision/RodamientosDelanterosScreen';
import RodamientosTraserosScreen from './screens/revision/RodamientosTraserosScreen';
import ServiciosScreen from './screens/revision/ServiciosScreen';
import SuspencionDelanteraScreen from './screens/revision/SuspencionDelanteraScreen';
import SuspencionTraseraScreen from './screens/revision/SuspencionTraseraScreen';
import ArticulosScreen from './screens/revision/ArticulosScreen';

//Pantallas de Entrega
import BoletaScreen from './screens/entrega/BoletaScreen';
import GolpesScreen from './screens/entrega/GolpesScreen';

import Menu from './screens/Menu';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Menu {...props} />}
      screenOptions={{
        drawerType: 'slide',
        overlayColor: 'rgba(0, 0, 0, 0.5)', // Cambia el fondo a semi-transparente
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="CheckOutScreen" component={CheckOutScreen} />
      <Drawer.Screen name="EntregaScreen" component={EntregaScreen} />

      <Drawer.Screen
        name="VehicleDetailsScreen"
        component={VehicleDetailsScreen}
      />
      <Drawer.Screen name="FirmaScreen" component={FirmaScreen} />
      <Drawer.Screen name="TipoTrabajoScreen" component={TipoTrabajoScreen} />

      <Drawer.Screen
        name="PhotosAndVideosScreen"
        component={PhotosAndVideosScreen}
      />
      <Drawer.Screen name="BoletaScreen" component={BoletaScreen} />
      <Drawer.Screen name="GolpesScreen" component={GolpesScreen} />

      <Drawer.Screen name="AccesoriosScreen" component={AccesoriosScreen} />

      <Drawer.Screen
        name="SuspencionDelanteraScreen"
        component={SuspencionDelanteraScreen}
      />
      <Drawer.Screen name="DireccionScreen" component={DireccionScreen} />
      <Drawer.Screen
        name="FrenosDelanterosScreen"
        component={FrenosDelanterosScreen}
      />
      <Drawer.Screen
        name="FrenosTraserosScreen"
        component={FrenosTraserosScreen}
      />
      <Drawer.Screen
        name="RodamientosDelanterosScreen"
        component={RodamientosDelanterosScreen}
      />
      <Drawer.Screen
        name="RodamientosTraserosScreen"
        component={RodamientosTraserosScreen}
      />
      <Drawer.Screen name="ServiciosScreen" component={ServiciosScreen} />
      <Drawer.Screen
        name="SuspencionTraseraScreen"
        component={SuspencionTraseraScreen}
      />
      <Drawer.Screen name="ArticulosScreen" component={ArticulosScreen} />
      <Drawer.Screen
        name="ScheduleAppointmentScreen"
        component={ScheduleAppointmentScreen}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  const { width } = Dimensions.get('window');
  const isTablet = width > 600;

  useEffect(() => {
    const setOrientation = async () => {
      if (isTablet) {
        // Si es tablet, poner
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE,
        );
      } else {
        // Si es smartphone, poner portrait
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT,
        );
      }
    };

    setOrientation();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Asegurar que la StatusBar se mantenga visible */}
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Pantallas iniciales fuera del contexto del Drawer */}
            <Stack.Screen name="Index" component={Index} />
            <Stack.Screen name="Login" component={Login} />

            {/* DrawerNavigator contiene todas las demás pantallas */}
            <Stack.Screen name="Dashboard" component={DrawerNavigator} />
            <Stack.Screen
              name="VehicleDetailsScreen"
              component={DrawerNavigator}
            />
            <Stack.Screen name="CheckOutScreen" component={CheckOutScreen} />
            <Stack.Screen name="EntregaScreen" component={EntregaScreen} />
            <Stack.Screen
              name="ScheduleAppointmentScreen"
              component={ScheduleAppointmentScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}
