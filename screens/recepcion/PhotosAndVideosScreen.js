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

const PhotosAndVideosScreen = ({ navigation }) => {
  const [attachments, setAttachments] = useState([
    { id: 1, type: 'photo', selected: false },
    { id: 2, type: 'photo', selected: false },
    { id: 3, type: 'video', selected: false },
    { id: 4, type: 'photo', selected: false },
    { id: 5, type: 'photo', selected: false },
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setAttachments((prevAttachments) =>
        prevAttachments.map((item) => ({ ...item, selected: false })),
      );
    }
  };

  const handleSelectItem = (id) => {
    setAttachments((prevAttachments) =>
      prevAttachments.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const handleDeleteSelected = () => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((item) => !item.selected),
    );
  };

  const renderAttachment = ({ item }) => {
    const isSelected = item.selected;
    const isPhoto = item.type === 'photo';

    return (
      <TouchableOpacity
        style={styles.attachmentItem}
        disabled={!isEditing}
        onPress={() => handleSelectItem(item.id)}
      >
        <View style={styles.iconContainer}>
          <Icon name={isPhoto ? 'image' : 'film'} size={40} color="#888" />
        </View>
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
            onPress={() => console.log('Subir Archivo')}
          >
            <Icon name="upload" size={20} color="#000" />
            <Text style={styles.actionText}>Subir Archivo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log('Abrir Cámara')}
          >
            <Icon name="camera" size={20} color="#000" />
            <Text style={styles.actionText}>Abrir Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log('Indicar Golpe(s)')}
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
      </View>

      <FooterButtons
        onBack={() => navigation.goBack()}
        onDelete={() => console.log('Eliminar Boleta')}
        onNext={() => navigation.navigate('FirmaScreen')}
      />
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
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  attachmentCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  attachmentList: {
    flexDirection: 'row',
  },
  attachmentItem: {
    width: 80,
    height: 80,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    position: 'relative',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#FFD700',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  editText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  editFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelEditButton: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  deleteEditButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 5,
  },
});

export default PhotosAndVideosScreen;
