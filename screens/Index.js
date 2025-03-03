import React, { useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setLoggedIn } from '../src/contexts/AppSlice';
import { ReadEmpresa } from '../src/services/EmpresaService';
import { setEmpresa } from '../src/contexts/AppSlice';
import { addAccesorio } from '../src/contexts/BoletaSlice';
import { getAccesories } from '../src/services/AccesorioService';
import { processAccessories } from '../src/utils/processData/processAccessories';

const Index = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // const rawAccessories = await getAccesories();
        // const processedAccessories = await processAccessories(rawAccessories);
        // processedAccessories.forEach((accessory) => {
        //   dispatch(addAccesorio(accessory));
        // });

        const empresa = await ReadEmpresa(6);
        dispatch(setEmpresa(empresa));

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

    checkSession();
  }, [dispatch, navigation]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <View style={{ flex: 1, alignItems: 'center', paddingVertical: 20 }}>
        <Text>Index</Text>
      </View>
    </ScrollView>
  );
};

export default Index;
