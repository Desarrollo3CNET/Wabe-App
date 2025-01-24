import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateDireccionItem } from '../../src/contexts/RevisionSlice';
import Header from '../../src/components/recepcion/Header';
import FooterButtonsRevision from '../../src/components/recepcion/FooterButtonsRevision';
import AddArticleModal from '../../src/components/revision/AddArticleModal';

const DireccionReviewScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const direccionDetails = useSelector((state) => state.revision.direccion);
  const [modalVisibleArticulo, setModalVisibleArticulo] = useState(false);

  const handleUpdateStatus = (id, side, status) => {
    dispatch(updateDireccionItem({ id, side, status }));
  };

  return (
    <View style={styles.container}>
      <Header title="Revisión" />
      <View style={styles.content}>
        <Text style={styles.title}>Revisión de Dirección</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.columnContainer}>
            {/* Dirección Izquierda */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dirección Izquierda</Text>
              {direccionDetails
                .filter((item) => item.estadoIzquierda !== undefined)
                .map((item) => (
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

            {/* Dirección Derecha */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dirección Derecha</Text>
              {direccionDetails
                .filter((item) => item.estadoDerecha !== undefined)
                .map((item) => (
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

          {/* Dirección General */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dirección General</Text>
            {direccionDetails
              .filter((item) => item.estadoGeneral !== undefined)
              .map((item) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.itemName}>{item.nombre}</Text>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      item.estadoGeneral === 'Bueno' && styles.selected,
                    ]}
                    onPress={() =>
                      handleUpdateStatus(item.id, 'general', 'Bueno')
                    }
                  >
                    <Text style={styles.statusText}>Bueno</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      item.estadoGeneral === 'Malo' && styles.selected,
                    ]}
                    onPress={() =>
                      handleUpdateStatus(item.id, 'general', 'Malo')
                    }
                  >
                    <Text style={styles.statusText}>Malo</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </ScrollView>
      </View>

      <FooterButtonsRevision
        onBack={() => navigation.navigate('RodamientosReviewScreenBack')}
        onDelete={() => setModalVisibleArticulo(true)}
        onNext={() => navigation.navigate('ExtrasReviewScreen')}
      />

      <AddArticleModal
        visible={modalVisibleArticulo}
        onClose={() => setModalVisibleArticulo(false)}
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30, // Más margen debajo del título
    marginTop: 10, // Más margen encima del título
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
});

export default DireccionReviewScreen;
