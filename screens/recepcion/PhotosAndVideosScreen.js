import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import Icon from 'react-native-vector-icons/FontAwesome';
import GolpesModal from '../../src/components/recepcion/GolpesModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAttachment,
  toggleSelectAttachment,
  deleteSelectedAttachments,
} from '../../src/contexts/BoletaSlice';
import GenericModal from '../../src/components/recepcion/GenericModal';

const PhotosAndVideosScreen = ({ navigation, route }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVisibleBoleta, setmodalVisibleBoleta] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta');
  const [modalMessage, setModalMessage] = useState('');

  const dispatch = useDispatch();

  const attachments = useSelector((state) => state.boleta.LIST_IMAGES);
  const esquema = useSelector((state) => state.boleta.BOL_CAR_EXQUEMA);

  const { fromScreen } = route.params || {};

  const handleNext = async () => {
    if (attachments && attachments.length > 0) {
      navigation.navigate('AccesoriosScreen');
    } else {
      setCaseType('Notificacion');
      setModalMessage(
        'Por favor, agregue al menos una imagen antes de continuar.',
      );
      setmodalVisibleBoleta(true);
    }
  };

  const renderFooterButtons = () => {
    switch (fromScreen) {
      case 'TipoTrabajoScreen':
      case 'AccesoriosScreen':
        return (
          <FooterButtons
            onBack={() =>
              navigation.navigate('TipoTrabajoScreen', {
                fromScreen: 'PhotosAndVideosScreen',
              })
            }
            onDelete={() => {
              setCaseType('CancelBoleta');
              setmodalVisibleBoleta(true);
            }}
            onNext={handleNext}
          />
        );
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

  const decodeBase64Image = (base64) => {
    return `data:image/jpeg;base64,${base64}`;
  };

  const renderAttachments = () => (
    <View style={styles.decodedPhotoList}>
      {attachments.map((base64, index) => (
        <View key={index} style={styles.decodedPhotoContainer}>
          <Image
            source={{ uri: decodeBase64Image(base64) }}
            style={styles.decodedImage}
          />
        </View>
      ))}
    </View>
  );

  const renderEsquema = () => (
    <View style={styles.esquemaContainer}>
      <Text style={styles.sectionTitle}>Golpes del vehículo</Text>
      <Image
        source={{ uri: decodeBase64Image(esquema) }}
        style={styles.responsiveDecodedImage}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Recepción" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {fromScreen === 'TipoTrabajoScreen' ||
        fromScreen === 'AccesoriosScreen' ? (
          <View style={styles.content}>
            {/* Contenido existente */}
            <Text style={styles.title}>Fotografías y Videos</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {} /* handleUploadFile */}
              >
                <Icon name="upload" size={20} color="#000" />
                <Text style={styles.actionText}>Subir Archivo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {} /* handleOpenCamera */}
              >
                <Icon name="camera" size={20} color="#000" />
                <Text style={styles.actionText}>Abrir Cámara</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setModalVisible(true)}
              >
                <Icon name="car" size={20} color="#000" />
                <Text style={styles.actionText}>Indicar Golpe(s)</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.attachmentCount}>
              {attachments.length} archivos adjuntos
            </Text>
            <FlatList
              data={attachments}
              renderItem={() => {} /* renderAttachment */}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              contentContainerStyle={styles.attachmentList}
            />
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.title}>Fotografías y Videos</Text>
            {renderAttachments()}
            {renderEsquema()}
          </View>
        )}
        {renderFooterButtons()}
        <GenericModal
          visible={modalVisibleBoleta}
          onClose={() => setmodalVisibleBoleta(false)}
          navigation={navigation}
          caseType={caseType}
          message={modalMessage}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#333', padding: 10 }, // Más margen
  content: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 50, // Espacio suficiente entre el header y el contenedor
    flex: 1,
  },
  esquemaContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  scrollableImageContainer: {
    flex: 1,
    maxHeight: 300, // Controla la altura visible del contenedor
    overflow: 'scroll',
  },
  responsiveDecodedImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 2, // Asegura que la imagen se adapta al ancho disponible
    resizeMode: 'contain', // Mantiene la proporción de la imagen
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20, // Separación adecuada entre los títulos y el contenido
  },
  decodedPhotoContainer: {
    flex: 1,
    width: '100%',
    maxHeight: 300, // Limita la altura visible inicial
    minHeight: 200, // Altura mínima para mantener el diseño consistente
    overflow: 'hidden', // Asegura que los elementos no se salgan del contenedor
    alignItems: 'center',
    justifyContent: 'center',
  },
  decodedImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  largeDecodedImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 2, // Mantener la proporción de la imagen
    resizeMode: 'contain', // Ajustar la imagen al contenedor
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10, // Espacio entre el texto y la imagen
  },

  actionButtons: { flexDirection: 'row', marginBottom: 10 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  actionText: { marginLeft: 5 },
});

export default PhotosAndVideosScreen;
