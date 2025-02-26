import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addImage, removeImage } from '../../contexts/RevisionSlice';

const ArticulosPhotosModal = ({ ART_CODE, ART_NOMBRE, showCameraButton }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const articulosFotos = useSelector((state) => state.revision.articulosFotos);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalImageVisible, setModalImageVisible] = useState(false);

  // Filtra el artículo por ART_CODE
  const articuloFotos = articulosFotos.find(
    (articulo) => articulo.ART_CODE === ART_CODE,
  );

  // Si no hay imágenes, inicializamos el arreglo
  const [images, setImages] = useState(
    articuloFotos ? articuloFotos.imagenes : [],
  );

  useEffect(() => {
    // Si el ART_CODE cambia, actualizamos las imágenes
    if (articuloFotos) {
      setImages(articuloFotos.imagenes);
    }
  }, [ART_CODE, articulosFotos]);

  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso de cámara necesario');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImage = {
        id: Date.now(),
        uri: result.assets[0].uri,
        base64: result.assets[0].base64 || '',
      };
      dispatch(addImage({ ART_CODE, image: newImage }));
    }
  };

  const handleUploadFile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso de galería necesario');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImage = {
        id: Date.now(),
        uri: result.assets[0].uri,
        base64: result.assets[0].base64 || '',
      };
      dispatch(addImage({ ART_CODE, image: newImage }));
    }
  };

  const handleDeleteSelected = (index) => {
    dispatch(removeImage({ ART_CODE, imageIndex: index }));
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  return (
    <View>
      {/* Botón para abrir el modal */}
      {!(
        showCameraButton === false &&
        (!articuloFotos || articuloFotos.length === 0)
      ) && (
        <TouchableOpacity
          style={[
            styles.cameraButtonFloating,
            {
              top: showCameraButton ? -50 : -45, // Se ajusta según showCameraButton
              right: showCameraButton ? -20 : 0, // Se ajusta según showCameraButton
              backgroundColor: articuloFotos ? '#FFD700' : '#A9A9A9', // Cambia el color de fondo según articuloFotos
            },
          ]}
          onPress={handleOpenModal}
        >
          <Icon name="camera" size={15} color="black" />
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fotos de {ART_NOMBRE}</Text>

            {/* Botones dentro del modal */}
            <View style={styles.actionButtons}>
              {showCameraButton && (
                <>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleOpenCamera}
                  >
                    <Icon name="camera" size={20} color="#000" />
                    <Text style={styles.actionText}>Tomar foto</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleUploadFile}
                  >
                    <Icon name="upload" size={20} color="#000" />
                    <Text style={styles.actionText}>Subir Archivo</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Lista de imágenes */}
            <FlatList
              data={images}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              renderItem={({ item, index }) => (
                <View style={styles.thumbnailContainer}>
                  {/* Miniatura de la imagen */}
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedImage(
                        showCameraButton
                          ? item.uri
                          : `data:image/jpeg;base64,${item}`,
                      );
                      setModalImageVisible(true); // Asegúrate de abrir el modal al seleccionar una imagen
                    }}
                  >
                    <Image
                      source={{
                        uri: showCameraButton
                          ? item.uri
                          : `data:image/jpeg;base64,${item}`,
                      }}
                      style={styles.thumbnailImage}
                    />
                  </TouchableOpacity>

                  {/* Botón de eliminar solo si showCameraButton es verdadero */}
                  {showCameraButton && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteSelected(index)}
                    >
                      <Icon name="trash" size={20} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="arrow-left" size={20} color="#000" />
                <Text style={styles.backButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isModalImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalImageVisible(false)} // Cerrar modal al presionar fuera de la imagen
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setModalImageVisible(false)} // Cerrar modal al tocar fuera de la imagen
        >
          <View style={styles.imageModalContent}>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalImageVisible(false)} // Cerrar modal al presionar el botón
            >
              <Icon name="times" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageModalContent: {
    position: 'relative',
    width: '90%',
    height: '80%',
  },
  cameraButtonFloating: {
    position: 'absolute', // Asegura que se posicione encima de otro componente
    backgroundColor: '#FFD700', // Amarillo para destacar
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 25, // Forma redondeada
    width: 40, // Tamaño pequeño
    height: 40, // Tamaño pequeño
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Asegura que el botón esté encima del otro contenido
  },
  cameraButton: {
    alignSelf: 'flex-start', // Asegura que se coloque en su propia línea
    width: '100%', // Ocupará toda la fila y se pondrá debajo del botón "Malo"
    alignItems: 'center', // Centra el ícono dentro del botón
    padding: 10,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginTop: 5, // Espacio entre el botón "Malo" y el botón de la cámara
  },
  deleteEditButton: {
    padding: 10,
    backgroundColor: '#FFD700', // Amarillo
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#000', // Texto en color negro
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    padding: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0',
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    flex: 1,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700', // Amarillo
    borderRadius: 50,
    padding: 5,
  },
  actionText: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    height: '80%',
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  thumbnailContainer: {
    margin: 5,
    position: 'relative',
    padding: 5,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    padding: 10,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default ArticulosPhotosModal;
