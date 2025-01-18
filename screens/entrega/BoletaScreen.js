import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';

const BoletaScreen = ({ navigation, route }) => {
  const { fromScreen } = route.params || {};

  const renderFooterButtons = () => {
    switch (fromScreen) {
      case 'CheckOutScreen':
        return (
          <FooterButtons
            onBack={() => navigation.navigate('CheckOutScreen')}
            showDelete={false}
            showNext={false}
          />
        );
      case 'EntregaScreen':
        return (
          <FooterButtons
            onBack={() => navigation.navigate('EntregaScreen')}
            showDelete={false}
            showNext={false}
          />
        );
      default:
        return (
          <FooterButtons
            onBack={() => navigation.navigate('Dashboard')}
            showDelete={false}
            showNext={false}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Boleta" />

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Boleta</Text>

          {/* Row Content */}
          <View style={styles.row}>
            {/* Left Section */}
            <View style={styles.leftSection}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>SERVICIO DE VIAJEROS SUIZA</Text>

              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value}>2290-8909</Text>

              <Text style={styles.label}>Placa</Text>
              <Text style={styles.value}>834620</Text>

              <Text style={styles.label}>Kilómetros</Text>
              <Text style={styles.value}>55</Text>

              <Text style={styles.label}>Combustible</Text>
              <Text style={styles.value}>3/4</Text>
            </View>

            {/* Right Section */}
            <View style={styles.rightSection}>
              <Text style={styles.label}>Accesorios</Text>
              <Text style={styles.value}>Artículo 1</Text>
              <Text style={styles.value}>Artículo 2</Text>
              <Text style={styles.value}>Artículo 3</Text>
              <Text style={styles.value}>Artículo 4</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {renderFooterButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10, // Margen general del ScrollView
  },
  contentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15, // Espaciado vertical entre el Header y Footer
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  leftSection: {
    flex: 1,
    marginRight: 10,
  },
  rightSection: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10, // Ajuste horizontal
    marginBottom: 10, // Espaciado inferior con el borde
    borderRadius: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default BoletaScreen;
