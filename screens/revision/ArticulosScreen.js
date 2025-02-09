import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import AddArticleModal from '../../src/components/revision/AddArticleModal';
import GenericModal from '../../src/components/recepcion/GenericModal';
import saveArticulos from '../../src/services/ArticulosService';

const ArticulosScreen = ({ navigation, route }) => {
  // State for "Observaciones"
  const [observaciones, setObservaciones] = useState('');
  const { fromScreen } = route.params || {};
  const [modalVisibleArticulo, setModalVisibleArticulo] = useState(false);
  const [modalVisibleRevision, setModalVisibleRevision] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta');
  const [modalMessage, setModalMessage] = useState('');

  const boleta = useSelector((state) => state.boleta);

  const articulosMantenimiento = useSelector((state) =>
    state.revision.articulosMantenimiento
      .map((categoria) => ({
        ...categoria,
        Articulos: categoria.Articulos.filter(
          (articulo) => articulo.ESTADO === false,
        ),
      }))
      .filter((categoria) => categoria.Articulos.length > 0),
  );

  const renderFooterButtons = () => {
    switch (fromScreen) {
      case 'ReviewScreen':
        return (
          <FooterButtons
            onBack={() => navigation.navigate('ReviewScreen')}
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
  const handleNext = async () => {
    setCaseType('Notificacion');

    try {
      // Crear el array de nombres de artículos malos
      const listArticulos = articulosMantenimiento.map(
        (articulo) => articulo.ART_NOMBRE,
      );

      // Llamar a la función SaveArticulos con los parámetros correspondientes
      const response = await saveArticulos(
        boleta.BOL_CODE, // idBoleta
        observaciones, // observaciones
        boleta.EMP_CODE, // idEmpresa
        listArticulos, // lista de artículos
      );

      if (response && response.success) {
        // Mensaje de éxito
        setModalMessage(`Se ha finalizado la revisión correctamente`);
        navigation.navigate('CheckOutScreen');
      } else {
        // Mensaje de error en caso de respuesta no exitosa
        setModalMessage(
          'Ocurrió un error al guardar los artículos. Por favor, intente de nuevo.',
        );
      }
    } catch (error) {
      console.error('Error en handleNext:', error);

      // Mensaje de error en caso de excepción
      setCaseType('Error');
      setModalMessage(
        'Ocurrió un error inesperado al intentar guardar los artículos. Por favor, intente más tarde.',
      );
    }

    // Mostrar el modal de resultado
    setModalVisibleRevision(true);
  };

  // Render a simple list of articles for "EntregaScreen"
  if (fromScreen === 'EntregaScreen') {
    return (
      <View style={styles.container}>
        <Header title="Artículos" />
        <View style={styles.content}>
          <Text style={styles.title}>Lista de Artículos</Text>
          <ScrollView>
            {articulosMantenimiento.length > 0 ? (
              articulosMantenimiento.map((articulo, index) => (
                <View key={index} style={styles.simpleCard}>
                  <Text style={styles.cardTitle}>{articulo}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noArticles}>No hay artículos</Text>
            )}
          </ScrollView>
        </View>
        {renderFooterButtons()}
      </View>
    );
  }

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
          {articulosMantenimiento.length > 0 ? (
            articulosMantenimiento.map((categoria, index) => (
              <View key={index}>
                <Text style={styles.sectionTitle}>
                  {categoria.CATEGORIA_NOMBRE}
                </Text>
                {categoria.Articulos.length > 0 ? (
                  categoria.Articulos.map((articulo, index) => (
                    <View key={index} style={styles.card}>
                      <Text style={styles.cardTitle}>
                        {articulo.ART_NOMBRE} - {articulo.ART_CODE}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noArticles}>
                    No hay artículos en esta categoría
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noArticles}>No hay artículos</Text>
          )}
        </ScrollView>
      </View>

      {renderFooterButtons()}

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
  simpleCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
