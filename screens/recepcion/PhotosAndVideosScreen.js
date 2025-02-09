import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import Header from '../../src/components/recepcion/Header';
import FooterButtons from '../../src/components/recepcion/FooterButtons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
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

  const handleUploadFile = () => {
    launchImageLibrary(
      { mediaType: 'mixed', selectionLimit: 1 },
      (response) => {
        if (response.didCancel) return;
        if (response.assets) {
          const newAttachment = {
            id: Date.now(),
            uri: response.assets[0].uri,
            type: response.assets[0].type.includes('image') ? 'photo' : 'video',
            selected: false,
          };
          dispatch(addAttachment(newAttachment));
        }
      },
    );
  };

  const handleOpenCamera = () => {
    launchCamera({ mediaType: 'mixed', saveToPhotos: true }, (response) => {
      if (response.didCancel) return;
      if (response.assets) {
        const newAttachment = {
          id: Date.now(),
          uri: response.assets[0].uri,
          type: response.assets[0].type.includes('image') ? 'photo' : 'video',
          selected: false,
        };
        dispatch(addAttachment(newAttachment));
      }
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      dispatch(toggleSelectAttachment(null)); // Deselect all attachments
    }
  };

  const handleSelectItem = (id) => {
    dispatch(toggleSelectAttachment(id));
  };

  const handleDeleteSelected = () => {
    dispatch(deleteSelectedAttachments());
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
        style={styles.attachmentItem}
        disabled={!isEditing}
        onPress={() => handleSelectItem(item.id)}
      >
        <Icon
          name={item.type === 'photo' ? 'image' : 'film'}
          size={40}
          color="#888"
        />
        {isEditing && (
          <View style={[styles.selectionCircle, isSelected && styles.selected]}>
            {isSelected && <View style={styles.innerCircle} />}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Recepción" />

      <View style={styles.content}>
        <Text style={styles.title}>Fotografías y Videos</Text>

        {fromScreen === 'EntregaScreen' ? (
          <View>
            {renderAttachments()}
            {renderEsquema()}
          </View>
        ) : (
          // <>
          //   {/* Título para la sección de fotos y videos */}
          //   <Text style={styles.sectionTitle}>Fotos y Videos</Text>

          //   {/* Renderizar fotos decodificadas de cadenas Base64 */}
          //   <FlatList
          //     data={attachments} // No hay filtro porque ya contiene el array de cadenas en Base64
          //     renderItem={({ item }) => (
          //       <View style={styles.decodedPhotoContainer}>
          //         {/* Renderizar la imagen decodificada del string Base64 */}
          //         <Image
          //           source={{ uri: `data:image/png;base64,${item}` }} // Decodificamos el string Base64
          //           style={styles.decodedImage}
          //         />
          //       </View>
          //     )}
          //     keyExtractor={(item, index) => index.toString()} // Usamos el índice como clave
          //     contentContainerStyle={styles.decodedPhotoList}
          //   />

          //   {/* Título para la sección del esquema */}
          //   <Text style={styles.sectionTitle}>Esquema</Text>

          //   {/* Mostrar esquema en grande */}
          //   <View style={styles.decodedPhotoContainer}>
          //     <Image
          //       source={{
          //         uri: `data:image/png;base64,${useSelector((state) => state.boleta.golpes.esquema)}`, // Decodificar el esquema en Base64
          //       }}
          //       style={styles.largeDecodedImage} // Nuevo estilo para la imagen del esquema
          //     />
          //   </View>
          // </>

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
              renderItem={renderAttachment}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              contentContainerStyle={styles.attachmentList}
            />

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
});

export default PhotosAndVideosScreen;
