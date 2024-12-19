import React from 'react';
import { ThemeProvider } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import store from './src/contexts/store';

import Login from './screens/Login';
import Index from './screens/Index';
import Dashboard from './screens/Dashboard';
import VehicleDetailsScreen from './screens/recepcion/VehicleDetailsScreen';
import FirmaScreen from './screens/recepcion/FirmaScreen';
import PhotosAndVideosScreen from './screens/recepcion/PhotosAndVideosScreen';
import AccesoriosScreen from './screens/recepcion/AccesoriosScreen';

import Menu from './screens/Menu';
import theme from './src/utils/RNEtheme';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Menu {...props} />}
      screenOptions={{
        drawerType: 'slide',
        overlayColor: 'transparent',
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen
        name="VehicleDetailsScreen"
        component={VehicleDetailsScreen}
      />
      <Drawer.Screen name="FirmaScreen" component={FirmaScreen} />
      <Drawer.Screen
        name="PhotosAndVideosScreen"
        component={PhotosAndVideosScreen}
      />
      <Drawer.Screen name="AccesoriosScreen" component={AccesoriosScreen} />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
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
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </ThemeProvider>
  );
}
