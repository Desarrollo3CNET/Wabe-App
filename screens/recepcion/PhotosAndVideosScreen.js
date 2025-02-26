import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker'; // Importar expo-image-picker

import GolpesModal from '../../src/components/recepcion/GolpesModal';
import VideoModal from '../../src/components/recepcion/VideoModal';

import { useDispatch, useSelector } from 'react-redux';
import {
  addImage,
  toggleSelectImage,
  deleteSelectedImage,
} from '../../src/contexts/BoletaSlice';
import GenericModal from '../../src/components/recepcion/GenericModal';

const PhotosAndVideosScreen = ({ navigation, route }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVisibleBoleta, setmodalVisibleBoleta] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta');
  const [modalMessage, setModalMessage] = useState('');

  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalImageVisible, setModalImageVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);

  const dispatch = useDispatch();

  // Corregir el acceso a las propiedades del estado global
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

  const handleUploadFile = async () => {
    // Solicitar permisos para acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso de galería necesario');
      return;
    }

    // Abrir la galería para seleccionar una imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo imágenes
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Solicitar el base64 de la imagen
    });

    // Verificar si el usuario canceló la selección
    if (result.canceled || !result.assets || result.assets.length === 0) {
      return; // No hacer nada si no se seleccionó imagen
    }

    // Obtener la imagen seleccionada
    const selectedImage = result.assets[0];

    const newAttachment = {
      id: Date.now(),
      uri: selectedImage.uri,
      type: 'photo',
      base64: selectedImage.base64, // Guardamos la imagen en base64
      selected: false,
    };

    dispatch(addImage(newAttachment)); // Agregamos la imagen como adjunto
  };

  const handleOpenCamera = async () => {
    // Solicitar permisos para la cámara
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso de cámara necesario');
      return;
    }

    // Abrir la cámara para capturar una foto
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Solicitar el base64 de la imagen
    });

    // Verificar si se ha cancelado la acción o si no se tomó ninguna foto
    if (result.canceled || !result.assets || result.assets.length === 0) {
      return; // No hacer nada si no se tomó una foto
    }

    const selectedImage = result.assets[0]; // Obtén la imagen capturada

    // Verifica si la propiedad base64 está presente en selectedImage
    const newAttachment = {
      id: Date.now(),
      uri: selectedImage.uri,
      type: 'photo',
      base64: selectedImage.base64 || '', // Asegúrate de que la propiedad base64 esté presente
      selected: false,
    };

    dispatch(addImage(newAttachment)); // Agregamos la imagen como adjunto
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      dispatch(toggleSelectImage(null)); // Deselect all attachments
    }
  };

  const handleOpenVideo = async () => {
    setVideoVisible(!videoVisible);
  };

  const handleSelectItem = (id) => {
    dispatch(toggleSelectImage(id));
  };

  const handleDeleteSelected = () => {
    dispatch(deleteSelectedImage());
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

  const renderAttachment = ({ item }) => {
    const isSelected = item.selected;

    return (
      <TouchableOpacity
        style={[styles.attachmentItem, isSelected && styles.selectedAttachment]}
        onPress={() => {
          if (isEditing) {
            // Si está en modo edición, seleccionar/deseleccionar imagen
            handleSelectItem(item.id);
          } else {
            // Si NO está en modo edición, mostrar la imagen en el modal
            setSelectedImage(item.uri);
            setModalImageVisible(true);
          }
        }}
      >
        {/* <Icon
          name={item.type === 'photo' ? 'image' : 'film'}
          size={40}
          color="#888"
        /> */}
        {isEditing && (
          <View style={[styles.selectionCircle, isSelected && styles.selected]}>
            {isSelected && <View style={styles.innerCircle} />}
          </View>
        )}
        <Image source={{ uri: item.uri }} style={styles.thumbnailImage} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción" />

      {videoVisible && <VideoModal />}

      <View style={styles.content}>
        <Text style={styles.title}>Fotografías y Videos</Text>

        {fromScreen === 'EntregaScreen' ? (
          <View>
            {renderAttachments()}
            {renderEsquema()}
          </View>
        ) : (
          // Renderizar el bloque original para otras pantallas
          <>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleUploadFile}
              >
                <Icon name="upload" size={20} color="#000" />
                <Text style={styles.actionText}>Subir Archivo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleOpenCamera}
              >
                <Icon name="camera" size={20} color="#000" />
                <Text style={styles.actionText}>Tomar foto</Text>
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
              renderItem={renderAttachment}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              contentContainerStyle={styles.attachmentList}
            />

            {/* MODAL PARA MOSTRAR LA IMAGEN */}
            <Modal
              visible={isModalImageVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalImageVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalContainer}
                activeOpacity={1}
                onPress={() => setModalImageVisible(false)}
              >
                <View style={styles.modalContent}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.fullImage}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalImageVisible(false)}
                  >
                    <Icon name="times" size={30} color="white" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditToggle}
            >
              <Icon name="edit" size={18} color="#000" />
              <Text style={styles.editText}>
                {isEditing ? 'Cancelar' : 'Editar'}
              </Text>
            </TouchableOpacity>

            {isEditing && (
              <View style={styles.editFooter}>
                <TouchableOpacity
                  style={styles.cancelEditButton}
                  onPress={handleEditToggle}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteEditButton}
                  onPress={handleDeleteSelected}
                >
                  <Icon name="trash" size={18} color="#000" />
                  <Text style={styles.buttonText}>Borrar</Text>
                </TouchableOpacity>
              </View>
            )}

            <GolpesModal
              visible={isModalVisible}
              onClose={() => setModalVisible(false)}
            />
          </>
        )}
      </View>

      {renderFooterButtons()}

      <GenericModal
        visible={modalVisibleBoleta}
        onClose={() => setmodalVisibleBoleta(false)}
        navigation={navigation}
        caseType={caseType}
        message={modalMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#333', padding: 10 },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionText: { marginLeft: 5, fontWeight: 'bold' },
  attachmentList: {
    flexDirection: 'row',
  },
  attachmentItem: {
    width: 80,
    height: 80,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  selectionCircle: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
  },
  selected: { backgroundColor: '#FFD700' },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  thumbnailImage: {
    width: 60, // Ajusta el tamaño de la miniatura según lo necesites
    height: 60,
    borderRadius: 10, // Si deseas bordes redondeados
    resizeMode: 'cover', // Asegura que la imagen se ajuste al contenedor
  },
  editButton: { flexDirection: 'row', alignSelf: 'flex-end', marginTop: 10 },
  editText: { marginLeft: 5, fontWeight: 'bold' },
  editFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelEditButton: {
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },
  deleteEditButton: {
    padding: 10,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: { marginLeft: 5, fontWeight: 'bold' },
  decodedPhotoContainer: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
  },
  decodedImage: {
    width: 100, // Ajusta el tamaño según sea necesario
    height: 100,
    resizeMode: 'contain', // Ajusta la imagen dentro del contenedor
  },
  decodedPhotoList: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#000',
  },
  largeDecodedImage: {
    width: '100%', // Toma todo el ancho disponible
    height: 200, // Ajusta según tus necesidades
    resizeMode: 'contain', // Mantiene las proporciones de la imagen
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    position: 'relative',
    width: '90%',
    height: '80%',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 20,
  },
});

export default PhotosAndVideosScreen;
