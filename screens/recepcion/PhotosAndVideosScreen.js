import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
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
} from '../../src/contexts/store';

const PhotosAndVideosScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const attachments = useSelector((state) => state.attachments.items);

  // Abrir galería y agregar archivo
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
          dispatch(addAttachment(newAttachment)); // Guardar en Redux
        }
      },
    );
  };

  // Abrir cámara y tomar una foto/video
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
        dispatch(addAttachment(newAttachment)); // Guardar en Redux
      }
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setAttachments((prevAttachments) =>
        prevAttachments.map((item) => ({ ...item, selected: false })),
      );
    }
  };

  const handleSelectItem = (id) => {
    dispatch(toggleSelectAttachment(id)); // Alternar selección en Redux
  };

  const handleDeleteSelected = () => {
    dispatch(deleteSelectedAttachments()); // Eliminar seleccionados en Redux
  };

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

        <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
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
      </View>

      <FooterButtons
        onBack={() => navigation.navigate('FirmaScreen')}
        onDelete={() => console.log('Eliminar Boleta')}
        onNext={() => navigation.navigate('AccesoriosScreen')}
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
    flex: 1, // Cada botón ocupa el mismo ancho
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginHorizontal: 5, // Espaciado horizontal entre botones
  },

  attachmentList: {
    flexDirection: 'row',
  },
  actionText: { marginLeft: 5, fontWeight: 'bold' },
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
});

export default PhotosAndVideosScreen;
