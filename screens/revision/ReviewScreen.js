import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleEstadoArticulo } from '../../src/contexts/RevisionSlice';
import Header from '../../src/components/recepcion/Header';
import FooterButtonsRevision from '../../src/components/recepcion/FooterButtonsRevision';
import AddArticleModal from '../../src/components/revision/AddArticleModal';
import GenericModal from '../../src/components/recepcion/GenericModal';
import { ValidateRevisionItems } from '../../src/utils/ValidateRevisionItems';

const ReviewScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const articulosMantenimiento = useSelector(
    (state) => state.revision.articulosMantenimiento,
  );
  const [modalVisibleArticulo, setModalVisibleArticulo] = useState(false);
  const [modalVisibleRevision, setModalVisibleRevision] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta');
  const [modalMessage, setModalMessage] = useState('');

  const handleUpdateStatus = (ART_CODE) => {
    dispatch(toggleEstadoArticulo(ART_CODE));
  };

  const handleNext = async () => {
    const isValid = await ValidateRevisionItems(articulosMantenimiento);

    if (isValid) {
      navigation.navigate('ArticulosScreen');
    } else {
      setCaseType('Notificacion');
      setModalMessage(
        'Por favor, complete al menos un estado para cada componente antes de continuar.',
      );
      setModalVisibleRevision(true);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Revisión" />
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {articulosMantenimiento.map((categoria) => (
            <View key={categoria.CAT_CODE} style={styles.section}>
              <Text style={styles.sectionTitle}>{categoria.CAT_NOMBRE}</Text>

              {categoria.Articulos.length > 0 ? (
                categoria.Articulos.map((item) => (
                  <View key={item.ART_CODE} style={styles.row}>
                    <Text style={styles.itemName}>{item.ART_NOMBRE}</Text>

                    <TouchableOpacity
                      style={[
                        styles.statusButton,
                        item.ESTADO === true && styles.selected,
                      ]}
                      onPress={() => handleUpdateStatus(item.ART_CODE)}
                    >
                      <Text style={styles.statusText}>Bueno</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.statusButton,
                        item.ESTADO === false && styles.selected,
                      ]}
                      onPress={() => handleUpdateStatus(item.ART_CODE)}
                    >
                      <Text style={styles.statusText}>Malo</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noItemsText}>
                  No hay artículos disponibles
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      <FooterButtonsRevision
        onBack={() => {
          setCaseType('CancelRevision');
          setModalVisibleRevision(true);
        }}
        onDelete={() => setModalVisibleArticulo(true)}
        onNext={handleNext}
      />

      {/* <AddArticleModal
        visible={modalVisibleArticulo}
        onClose={() => setModalVisibleArticulo(false)}
      /> */}

      <GenericModal
        visible={modalVisibleRevision}
        onClose={() => setModalVisibleRevision(false)}
        navigation={navigation}
        caseType={caseType}
        message={modalMessage}
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
    marginBottom: 30, // Añade espacio entre secciones
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
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
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemName: {
    flex: 2,
    fontSize: 18,
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
  noItemsText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
  },
});

export default ReviewScreen;
