import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import store from './src/contexts/Store';

//Pantallas generales
import Login from './screens/Login';
import Index from './screens/Index';
import Dashboard from './screens/Dashboard';
import CheckOutScreen from './screens/CheckOutScreen';
import EntregaScreen from './screens/EntregaScreen';
import ScheduleAppointmentScreen from './screens/ScheduleAppointmentScreen';

//Pantallas de Revisión
import VehicleDetailsScreen from './screens/recepcion/VehicleDetailsScreen';
import FirmaScreen from './screens/recepcion/FirmaScreen';
import TipoTrabajoScreen from './screens/recepcion/TipoTrabajoScreen';
import PhotosAndVideosScreen from './screens/recepcion/PhotosAndVideosScreen';
import AccesoriosScreen from './screens/recepcion/AccesoriosScreen';

//Pantallas de Revisión
import SuspensionReviewScreen from './screens/revision/SuspensionReviewScreen';
import SuspensionReviewScreenBack from './screens/revision/SuspensionReviewScreenBack';
import FrenosReviewScreen from './screens/revision/FrenosReviewScreen';
import FrenosReviewScreenBack from './screens/revision/FrenosReviewScreenBack';
import RodamientosReviewScreen from './screens/revision/RodamientosReviewScreen';
import RodamientosReviewScreenBack from './screens/revision/RodamientosReviewScreenBack';
import DireccionReviewScreen from './screens/revision/DireccionReviewScreen';
import ExtrasReviewScreen from './screens/revision/ExtrasReviewScreen';
import ArticulosScreen from './screens/revision/ArticulosScreen';

//Pantallas de Entrega
import BoletaScreen from './screens/entrega/BoletaScreen';

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
      <Drawer.Screen name="AccesoriosScreen" component={AccesoriosScreen} />
      <Drawer.Screen
        name="SuspensionReviewScreen"
        component={SuspensionReviewScreen}
      />
      <Drawer.Screen
        name="SuspensionReviewScreenBack"
        component={SuspensionReviewScreenBack}
      />
      <Drawer.Screen name="FrenosReviewScreen" component={FrenosReviewScreen} />
      <Drawer.Screen
        name="FrenosReviewScreenBack"
        component={FrenosReviewScreenBack}
      />
      <Drawer.Screen
        name="RodamientosReviewScreen"
        component={RodamientosReviewScreen}
      />
      <Drawer.Screen
        name="RodamientosReviewScreenBack"
        component={RodamientosReviewScreenBack}
      />
      <Drawer.Screen
        name="DireccionReviewScreen"
        component={DireccionReviewScreen}
      />
      <Drawer.Screen name="ExtrasReviewScreen" component={ExtrasReviewScreen} />
      <Drawer.Screen name="BoletaScreen" component={BoletaScreen} />
      <Drawer.Screen name="ArticulosScreen" component={ArticulosScreen} />
      <Drawer.Screen
        name="ScheduleAppointmentScreen"
        component={ScheduleAppointmentScreen}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}
