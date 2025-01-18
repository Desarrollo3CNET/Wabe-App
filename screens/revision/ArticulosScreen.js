import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import AddArticleModal from '../../src/components/revision/AddArticleModal';

const ArticulosScreen = ({ navigation, route }) => {
  // State for "Observaciones"
  const [observaciones, setObservaciones] = useState('');
  const { fromScreen } = route.params || {};

  // Selectors to fetch articles from all slices
  const suspensionReview = useSelector((state) => state.suspensionReview.items);
  const suspensionBackReview = useSelector(
    (state) => state.suspensionBackReview.items,
  );
  const frenosReview = useSelector((state) => state.frenosReview.items);
  const frenosBackReview = useSelector((state) => state.frenosBackReview.items);
  const rodamientosReview = useSelector(
    (state) => state.rodamientosReview.items,
  );
  const rodamientosBackReview = useSelector(
    (state) => state.rodamientosBackReview.items,
  );
  const direccionReview = useSelector((state) => state.direccionReview.items);
  const extrasReview = useSelector((state) => state.extrasReview.items);
  const articulosGenericosMalos = useSelector(
    (state) => state.articulosGenericos.malos,
  );

  const [modalVisibleArticulo, setModalVisibleArticulo] = useState(false);

  // Helper function to get "malo" articles
  const getMaloArticles = (items, sectionName, isBack = false) => {
    const malos = [];
    const section = isBack ? 'Trasera' : 'Delantera';

    items.forEach((item) => {
      if (item.estadoDerecha === 'Malo') {
        malos.push({
          nombre: item.nombre,
          lado: 'Derecha',
          seccion: sectionName,
          posicion: section,
        });
      }
      if (item.estadoIzquierda === 'Malo') {
        malos.push({
          nombre: item.nombre,
          lado: 'Izquierda',
          seccion: sectionName,
          posicion: section,
        });
      }
      if (item.estadoGeneral === 'Malo') {
        malos.push({
          nombre: item.nombre,
          lado: 'General',
          seccion: sectionName,
          posicion: section,
        });
      }
    });

    return malos;
  };

  const renderFooterButtons = () => {
    switch (fromScreen) {
      case 'ExtrasReviewScreen':
        return (
          <FooterButtons
            onBack={() => navigation.navigate('ExtrasReviewScreen')}
            onDelete={() => setModalVisibleArticulo(true)}
            onNext={handleNext}
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

  // Aggregate all "malo" articles
  const articulosMalos = [
    ...getMaloArticles(suspensionReview, 'Suspensión', false),
    ...getMaloArticles(suspensionBackReview, 'Suspensión', true),
    ...getMaloArticles(frenosReview, 'Frenos', false),
    ...getMaloArticles(frenosBackReview, 'Frenos', true),
    ...getMaloArticles(rodamientosReview, 'Rodamientos', false),
    ...getMaloArticles(rodamientosBackReview, 'Rodamientos', true),
    ...getMaloArticles(direccionReview, 'Dirección', false),
    ...extrasReview
      .filter((item) => item.estado === 'Malo')
      .map((item) => ({
        nombre: item.nombre,
        lado: 'General',
        seccion: item.section,
        posicion: 'General',
      })),
    ...articulosGenericosMalos.map((nombre) => ({
      nombre,
      lado: 'General',
      seccion: 'Artículos Genéricos',
      posicion: 'General',
    })),
  ];

  const handleNext = () => {
    Alert.alert(
      'Revisión completada',
      `Se ha finalizado la revisión correctamente.\nObservaciones: ${observaciones}`,
    );
    navigation.navigate('CheckOutScreen');
  };

  return (
    <View style={styles.container}>
      <Header title="Artículos" />
      <View style={styles.content}>
        <Text style={styles.title}>Elegir Artículos</Text>
        <Text style={styles.subtitle}>Observaciones</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese sus observaciones aquí"
          value={observaciones}
          onChangeText={(text) => setObservaciones(text)}
        />
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Artículos Seleccionados</Text>
        <ScrollView>
          {articulosMalos.length > 0 ? (
            articulosMalos.map((articulo, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{articulo.nombre}</Text>
                <Text style={styles.cardText}>
                  <Text style={styles.cardLabel}>Lado: </Text>
                  {articulo.lado}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.cardLabel}>Sección: </Text>
                  {articulo.seccion}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.cardLabel}>Posición: </Text>
                  {articulo.posicion}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noArticles}>No hay artículos</Text>
          )}
        </ScrollView>
      </View>

      {renderFooterButtons()}

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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#CCC',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 3,
  },
  cardLabel: {
    fontWeight: 'bold',
  },
  noArticles: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ArticulosScreen;
