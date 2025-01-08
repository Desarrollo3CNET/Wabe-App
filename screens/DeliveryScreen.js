import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../src/components/recepcion/Header';
import Icon from 'react-native-vector-icons/FontAwesome';

const DeliveryScreen = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate('CheckOutScreen'); // Cambia esto según la pantalla destino
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Boleta" />

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.boletaContainer}>
          <Text style={styles.sectionTitle}>Boleta</Text>

          {/* Left Section */}
          <View style={styles.row}>
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

              <Text style={[styles.label, { marginTop: 20 }]}>Documentos</Text>
              <View style={styles.documentRow}>
                <Icon name="file-pdf-o" size={24} color="#FF6347" />
                <Text style={styles.documentText}>Doc_1...PDF</Text>
              </View>
              <View style={styles.documentRow}>
                <Icon name="file-word-o" size={24} color="#1E90FF" />
                <Text style={styles.documentText}>Doc_2...docx</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Siguiente ➡</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  boletaContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  documentText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  nextButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default DeliveryScreen;
