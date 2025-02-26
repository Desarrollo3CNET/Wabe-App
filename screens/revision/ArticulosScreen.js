import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import GenericModal from '../../src/components/recepcion/GenericModal';
import {
  saveArticulos,
  saveImagesArticulos,
} from '../../src/services/BoletaService';
import { setCreatingRevisionFalse } from '../../src/contexts/AppSlice';
import { useDispatch, useSelector } from 'react-redux';
import ArticulosPhotosModal from '../../src/components/revision/ArticulosPhotosModal';

const ArticulosScreen = ({ navigation, route }) => {
  // State for "Observaciones"
  const [observaciones, setObservaciones] = useState('');
  const { fromScreen } = route.params || {};
  const [modalVisibleRevision, setModalVisibleRevision] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta');
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el spinner
  const dispatch = useDispatch();

  const boleta = useSelector((state) => state.boleta);
  const fotos = useSelector((state) => state.revision.articulosFotos);

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
  const articulosAgregados = useSelector((state) =>
    state.revision.articulosAgregados.filter(
      (articulo) => articulo.ESTADO === false || articulo.ESTADO === 'false',
    ),
  );

  const renderFooterButtons = () => {
    switch (fromScreen) {
      case 'ServiciosScreen':
        return (
          <FooterButtons
            onBack={() => navigation.navigate('ServiciosScreen')}
            showDelete={false}
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
      setIsLoading(true);

      const imagenesBase64 = fotos.map((articulo) => ({
        ART_CODE: articulo.ART_CODE,
        imagenes: articulo.imagenes.map((img) => img.base64), // Extrae solo la propiedad base64
      }));

      const listaFotos = {
        BOL_CODE: boleta.BOL_CODE, // Fecha de hoy en formato ISO 8601
        Articulos: imagenesBase64, // Imágenes de la boleta
      };

      await saveImagesArticulos(listaFotos);

      const todosLosArticulos = [
        ...articulosAgregados,
        ...articulosMantenimiento.flatMap((categoria) => categoria.Articulos),
      ];
      // Filtra los artículos cuyo ESTADO sea false o "false"
      const filteredArticulos = todosLosArticulos.filter(
        (articulo) => articulo.ESTADO === false || articulo.ESTADO === 'false',
      );
      // Mapea los artículos filtrados para crear el array listArticulos
      const listArticulos = filteredArticulos.map((articulo) => {
        // Verificar si ART_CODE es válido
        const codigoValido =
          articulo.ART_CODE !== null &&
          articulo.ART_CODE !== undefined &&
          articulo.ART_CODE !== '';
        // Construir el string con o sin ART_CODE
        return codigoValido
          ? `${articulo.ART_NOMBRE}-${articulo.ART_CODE}`
          : articulo.ART_NOMBRE;
      });
      //Llamar a la función SaveArticulos con los parámetros correspondientes
      await saveArticulos(
        boleta.BOL_CODE, // idBoleta
        observaciones, // observaciones
        boleta.EMP_CODE, // idEmpresa
        listArticulos, // lista de artículos
      );
      dispatch(setCreatingRevisionFalse());
      setObservaciones('');
      setModalMessage(`Se ha finalizado la revisión correctamente`);
      navigation.navigate('CheckOutScreen');
    } catch (error) {
      console.error('Error en handleNext:', error);
      // Mensaje de error en caso de excepción
      setModalMessage(
        'Ocurrió un error al guardar los artículos. Por favor, intente de nuevo.',
      );
    } finally {
      setIsLoading(false);
      setModalVisibleRevision(true);
    }
  };

  // Render a simple list of articles for "EntregaScreen"
  if (fromScreen === 'EntregaScreen') {
    return (
      <View style={styles.container}>
        <Header title="Artículos" />
        <View style={styles.content}>
          <Text style={styles.title}>Lista de Artículos</Text>
          <ScrollView>
            {articulosAgregados.length > 0 ? (
              articulosAgregados.map((articulo, index) => {
                console.log('Nombre del artículo:', articulo.ART_NOMBRE);

                let ART_NAME = articulo.ART_NOMBRE;
                let ART_CODE = 'Código desconocido';
                let codigoNumerico = 0;

                if (ART_NAME.includes(' - ')) {
                  // Caso estándar: "Nombre - Prefijo-Código"
                  const [nombreParte, codigoParte] = ART_NAME.split(' - ');
                  const [prefijo, codigo] = codigoParte.split('-');

                  ART_NAME = nombreParte;
                  ART_CODE = codigoParte;
                  codigoNumerico = parseInt(codigo);
                } else if (ART_NAME.includes('-')) {
                  // Caso especial: "Nombre con Prefijo-Código" sin ' - '
                  const partes = ART_NAME.split('-');

                  if (partes.length === 2) {
                    // Caso como "Tijereta Inf DI-17781"
                    ART_NAME = partes[0].trim();
                    ART_CODE = partes[1].trim();
                    codigoNumerico = parseInt(ART_CODE);
                    ART_CODE = `${partes[0].split(' ').pop()}-${ART_CODE}`; // Formato "Prefijo-Código"
                  }
                }

                return (
                  <View key={index} style={styles.simpleCard}>
                    {/* Mostrar el nombre en la primera fila */}
                    <Text style={styles.cardTitle}>{ART_NAME}</Text>
                    {/* Mostrar el código en la segunda fila */}
                    <Text style={styles.cardTitle}>{ART_CODE}</Text>

                    <ArticulosPhotosModal
                      ART_CODE={codigoNumerico} // Código como número
                      ART_NOMBRE={ART_NAME}
                      showCameraButton={false}
                    />
                  </View>
                );
              })
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
        <Text style={styles.title}>Artículos Seleccionados</Text>
        <Text style={styles.subtitle}>Observaciones</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese sus observaciones aquí"
          value={observaciones}
          onChangeText={(text) => setObservaciones(text)}
        />
        <View style={styles.divider} />

        <ScrollView>
          {articulosMantenimiento.length > 0 ? (
            articulosMantenimiento.map((categoria, index) => (
              <View key={index}>
                <Text style={styles.sectionTitle}>{categoria.CAT_NOMBRE}</Text>
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
          <Text style={styles.sectionTitle}>Artículos Agregados</Text>
          {articulosAgregados.length > 0 ? (
            articulosAgregados.map((articulo, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{articulo.ART_NOMBRE}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noArticles}>
              No hay artículos en esta categoría
            </Text>
          )}
        </ScrollView>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#FFD700"
            style={styles.spinner}
          />
        )}
      </View>

      {renderFooterButtons()}

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
    paddingTop: 10,
  },
  spinner: {
    marginTop: 30,
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
    marginBottom: 20,
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
