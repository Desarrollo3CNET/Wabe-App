import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import {
  agregarArticulo,
  eliminarArticulo,
} from './../../contexts/RevisionSlice';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddArticleModal = ({ visible, onClose }) => {
  const [articleName, setArticleName] = useState('');
  const [articleState, setArticleState] = useState('Bueno');
  const dispatch = useDispatch();
  const { buenos, malos } = useSelector(
    (state) => state.revision.articulosGenericos,
  );

  const handleAdd = () => {
    if (articleName.trim() === '') {
      alert('Por favor ingrese un nombre de artículo.');
      return;
    }

    dispatch(agregarArticulo({ nombre: articleName, estado: articleState }));
    setArticleName('');
  };

  const handleDelete = (nombre, estado) => {
    dispatch(eliminarArticulo({ nombre, estado }));
  };

  const renderArticleItem = (item, estado) => (
    <View style={styles.listItemContainer}>
      <Text style={styles.listItem}>{item}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item, estado)}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Agregar Artículo Adicional</Text>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre del Artículo:</Text>
              <TextInput
                style={styles.input}
                placeholder="Escriba el nombre del artículo"
                value={articleName}
                onChangeText={setArticleName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Estado del Artículo:</Text>
              <Picker
                selectedValue={articleState}
                style={styles.picker}
                onValueChange={(itemValue) => setArticleState(itemValue)}
              >
                <Picker.Item label="Bueno" value="Bueno" />
                <Picker.Item label="Malo" value="Malo" />
              </Picker>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>Agregar Artículo +</Text>
            </TouchableOpacity>
          </View>

          {/* Listas de Artículos */}
          <View style={styles.listsContainer}>
            <View style={styles.listSection}>
              <Text style={styles.listTitle}>Artículos Buenos</Text>
              <FlatList
                data={buenos}
                renderItem={({ item }) => renderArticleItem(item, 'Bueno')}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={styles.listSection}>
              <Text style={styles.listTitle}>Artículos Malos</Text>
              <FlatList
                data={malos}
                renderItem={({ item }) => renderArticleItem(item, 'Malo')}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>

          {/* Botones de Pie de Página */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Icon name="arrow-left" size={20} color="#000" />
              <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: '90%',
    height: '80%',
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#FFF',
  },
  picker: {
    height: 40,
    backgroundColor: '#EEE',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  listsContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  listSection: {
    flex: 1,
    marginHorizontal: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  listItem: {
    fontSize: 16,
    paddingVertical: 5,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#CCC',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#000',
    fontSize: 14,
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
    borderRadius: 10,
    flex: 1,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 5,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default AddArticleModal;
