import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux'; // Importar useSelector
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import moment from 'moment'; // Importamos moment para formatear fechas
import 'moment/locale/es'; // Importamos el idioma español
import colors from '../../src/utils/colors';

const BoletaScreen = ({ navigation, route }) => {
  const { fromScreen } = route.params || {};

  moment.locale('es');
  const formatDate = (date) =>
    moment(date).format('DD [de] MMMM [del] YYYY, h:mm A');

  // Recuperar los datos del slice de boleta
  const boleta = useSelector((state) => state.boleta);

  const renderFooterButtons = () => {
    switch (fromScreen) {
      case 'CheckOutScreen':
        return (
          <FooterButtons
            onBack={() => navigation.navigate('CheckOutScreen')}
            onNext={() =>
              navigation.navigate('FirmaScreen', {
                fromScreen: 'BoletaScreen',
              })
            }
            showDelete={false}
          />
        );
      case 'FirmaScreen':
      case 'EntregaScreen':
        return (
          <FooterButtons
            onBack={() => navigation.navigate('Dashboard')}
            onNext={() =>
              navigation.navigate('FirmaScreen', {
                fromScreen: 'BoletaScreen',
              })
            }
            showDelete={false}
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
      {/* <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}> */}

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Row Content */}
          <View style={styles.row}>
            {/* Left Section */}
            <View style={styles.leftSection}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{boleta.BOL_CLI_NOMBRE}</Text>

              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value}>{boleta.BOL_CLI_TELEFONO}</Text>

              <Text style={styles.label}>Correo</Text>
              <Text style={styles.value}>{boleta.BOL_CLI_CORREO}</Text>

              <Text style={styles.label}>Placa</Text>
              <Text style={styles.value}>{boleta.BOL_VEH_PLACA}</Text>

              <Text style={styles.label}>Kilómetros</Text>
              <Text style={styles.value}>{boleta.BOL_VEH_KM}</Text>

              <Text style={styles.label}>Combustible</Text>
              <Text style={styles.value}>{boleta.BOL_VEH_COMBUSTIBLE}</Text>

              <Text style={styles.label}>Observaciones</Text>
              <Text style={styles.value}>{boleta.BOL_OBSERVACIONES}</Text>

              <Text style={styles.label}>Estado</Text>
              <Text style={styles.value}>
                {boleta.BOL_ESTADO === 1 ? 'Activo' : 'Inactivo'}
              </Text>
            </View>

            {/* Right Section */}
            <View style={styles.rightSection}>
              <Text style={styles.label}>Accesorios</Text>
              {boleta.ACC_ACCESORIOS.length > 0 ? (
                boleta.ACC_ACCESORIOS.map((accesorio, index) => (
                  <Text key={index} style={styles.value}>
                    {accesorio.TIPACC_NOMBRE}
                  </Text>
                ))
              ) : (
                <Text style={styles.value}>N/A</Text>
              )}

              <Text style={styles.label}>Marca</Text>
              <Text style={styles.value}>{boleta.BOL_VEH_MARCA}</Text>

              <Text style={styles.label}>Estilo</Text>
              <Text style={styles.value}>{boleta.BOL_VEH_ESTILO}</Text>

              <Text style={styles.label}>Año</Text>
              <Text style={styles.value}>{boleta.BOL_VEH_ANIO || 'N/A'}</Text>

              <Text style={styles.label}>Color</Text>
              <Text style={styles.value}>{boleta.BOL_VEH_COLOR}</Text>
            </View>
          </View>

          {/* Additional Information */}
          <View style={styles.row}>
            <View style={styles.leftSection}>
              <Text style={styles.label}>Recibido por</Text>
              <Text style={styles.value}>
                {boleta.BOL_RECIBIDOPOR || 'N/A'}
              </Text>

              <Text style={styles.label}>Entregado por</Text>
              <Text style={styles.value}>
                {boleta.BOL_ENTREGADOPOR || 'N/A'}
              </Text>

              <Text style={styles.label}>No lavado</Text>
              <Text style={styles.value}>
                {boleta.BOL_UNWASHED ? 'Sí' : 'No'}
              </Text>
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.label}>Fecha de Creación</Text>
              <Text style={styles.value}>
                {formatDate(boleta.BOL_CREATEDATE)}
              </Text>

              <Text style={styles.label}>Fecha de Entrega</Text>
              <Text style={styles.value}>{formatDate(boleta.BOL_FECHA)}</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {renderFooterButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
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
    backgroundColor: colors.primary,
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
