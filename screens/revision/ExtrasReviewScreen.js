import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateExtrasItem } from '../../src/contexts/store';
import Header from '../../src/components/recepcion/Header';
import FooterButtonsRevision from '../../src/components/recepcion/FooterButtonsRevision';
import AddArticleModal from '../../src/components/revision/AddArticleModal';

const ExtrasReviewScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const extrasDetails = useSelector((state) => state.extrasReview.items);
  const [modalVisibleArticulo, setModalVisibleArticulo] = useState(false);

  const handleUpdateStatus = (id, status) => {
    dispatch(updateExtrasItem({ id, status }));
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción - Revisión de Extras" />
      <View style={styles.content}>
        <Text style={styles.title}>Revisión de Extras</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Servicios Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Servicios</Text>
            {extrasDetails
              .filter((item) => item.section === 'Servicios')
              .map((item) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.itemName}>{item.nombre}</Text>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      item.estado === 'Bueno' && styles.selected,
                    ]}
                    onPress={() => handleUpdateStatus(item.id, 'Bueno')}
                  >
                    <Text style={styles.statusText}>Bueno</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      item.estado === 'Malo' && styles.selected,
                    ]}
                    onPress={() => handleUpdateStatus(item.id, 'Malo')}
                  >
                    <Text style={styles.statusText}>Malo</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>

          {/* Acondicionamiento Exterior Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acondicionamiento Exterior</Text>
            {extrasDetails
              .filter((item) => item.section === 'Acondicionamiento Exterior')
              .map((item) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.itemName}>{item.nombre}</Text>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      item.estado === 'Bueno' && styles.selected,
                    ]}
                    onPress={() => handleUpdateStatus(item.id, 'Bueno')}
                  >
                    <Text style={styles.statusText}>Bueno</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      item.estado === 'Malo' && styles.selected,
                    ]}
                    onPress={() => handleUpdateStatus(item.id, 'Malo')}
                  >
                    <Text style={styles.statusText}>Malo</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </ScrollView>
      </View>

      <FooterButtonsRevision
        onBack={() => navigation.navigate('DireccionReviewScreen')}
        onDelete={() => setModalVisibleArticulo(true)}
        onNext={() =>
          navigation.navigate('ArticulosScreen', {
            fromScreen: 'ExtrasReviewScreen',
          })
        }
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
  section: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10,
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

export default ExtrasReviewScreen;
