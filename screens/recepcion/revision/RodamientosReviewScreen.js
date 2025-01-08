import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateRodamientosItem } from '../../../src/contexts/store';
import Header from '../../../src/components/recepcion/Header';
import FooterButtonsRevision from '../../../src/components/recepcion/FooterButtonsRevision';

const RodamientosReviewScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const rodamientosDetails = useSelector(
    (state) => state.rodamientosReview.items,
  );

  const handleUpdateStatus = (id, side, status) => {
    dispatch(updateRodamientosItem({ id, side, status }));
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción - Revisión de Rodamientos" />
      <View style={styles.content}>
        <Text style={styles.title}>Revisión de Rodamientos Delanteros</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.columnContainer}>
            {/* Rodamientos Izquierda */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rodamientos Izquierda</Text>
              {rodamientosDetails.map((item) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.itemName}>{item.nombre}</Text>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      item.estadoIzquierda === 'Bueno' && styles.selected,
                    ]}
                    onPress={() =>
                      handleUpdateStatus(item.id, 'izquierda', 'Bueno')
                    }
                  >
                    <Text style={styles.statusText}>Bueno</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      item.estadoIzquierda === 'Malo' && styles.selected,
                    ]}
                    onPress={() =>
                      handleUpdateStatus(item.id, 'izquierda', 'Malo')
                    }
                  >
                    <Text style={styles.statusText}>Malo</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Rodamientos Derecha */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rodamientos Derecha</Text>
              {rodamientosDetails.map((item) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.itemName}>{item.nombre}</Text>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      item.estadoDerecha === 'Bueno' && styles.selected,
                    ]}
                    onPress={() =>
                      handleUpdateStatus(item.id, 'derecha', 'Bueno')
                    }
                  >
                    <Text style={styles.statusText}>Bueno</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      item.estadoDerecha === 'Malo' && styles.selected,
                    ]}
                    onPress={() =>
                      handleUpdateStatus(item.id, 'derecha', 'Malo')
                    }
                  >
                    <Text style={styles.statusText}>Malo</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      <FooterButtonsRevision
        onBack={() => navigation.navigate('FrenosReviewScreenBack')}
        onDelete={() => console.log('Eliminar Boleta')}
        onNext={() => navigation.navigate('RodamientosReviewScreenBack')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    flex: 1,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemName: {
    flex: 2,
    fontSize: 16,
    color: '#000',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: '#FFD700',
  },
  statusText: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default RodamientosReviewScreen;
