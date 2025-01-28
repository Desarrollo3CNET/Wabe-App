import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import GenericModal from '../src/components/recepcion/GenericModal';

const Menu = ({ navigation }) => {
  const isCreatingBoleta = useSelector((state) => state.app.isCreatingBoleta);
  const isCreatingRevision = useSelector(
    (state) => state.app.isCreatingRevision,
  );

  const [modalVisibleBoleta, setmodalVisibleBoleta] = useState(false);
  const [modalVisibleRevision, setmodalVisibleRevision] = useState(false);

  const handleNavigation = (item) => {
    if (isCreatingBoleta) {
      setmodalVisibleBoleta(true);
    } else if (isCreatingRevision) {
      setmodalVisibleRevision(true);
    } else {
      navigation.navigate(item.route);
    }
  };

  const menuItems = [
    {
      title: 'Ver Citas',
      image: require('../assets/LISTA CITAS.png'),
      route: 'Dashboard',
    },
    {
      title: 'Revisiones Mecánico',
      image: require('../assets/FOTOGRAFÍAS.png'),
      route: 'CheckOutScreen',
    },
    {
      title: 'Revisiones Completadas',
      image: require('../assets/vehículos entregados .png'),
      route: 'EntregaScreen',
    },
  ];

  return (
    <>
      <View style={styles.drawerContainer}>
        <Text style={styles.headerText}>Menú principal</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleNavigation(item)}
          >
            <Image source={item.image} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <GenericModal
        visible={modalVisibleBoleta}
        onClose={() => setmodalVisibleBoleta(false)}
        navigation={navigation}
        caseType="CancelBoleta"
      />
      <GenericModal
        visible={modalVisibleRevision}
        onClose={() => setmodalVisibleRevision(false)}
        navigation={navigation}
        caseType="CancelRevision"
      />
    </>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },
  menuItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Menu;
