import React, { useState, useEffect } from 'react';
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
import GenericModal from '../../components/recepcion/GenericModal'; // Importación de GenericModal

const AddArticleModal = ({ visible, onClose }) => {
  const [articleName, setArticleName] = useState('');
  const [articleState, setArticleState] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const dispatch = useDispatch();

  const articulosAgregados = useSelector(
    (state) => state.revision.articulosAgregados,
  );

  // Estado local para los artículos filtrados
  const [buenos, setBuenos] = useState([]);
  const [malos, setMalos] = useState([]);

  const handleAdd = () => {
    if (articleName.trim() === '') {
      setModalMessage('Por favor ingrese un nombre de artículo.');
      setModalVisible(true);
      return;
    }

    if (!articleState) {
      setModalMessage('Por favor seleccione el estado del artículo.');
      setModalVisible(true);
      return;
    }

    const articuloExistente = articulosAgregados.some(
      (art) => art.ART_NOMBRE.toLowerCase() === articleName.toLowerCase(),
    );

    if (articuloExistente) {
      setModalMessage('El artículo ya existe.');
      setModalVisible(true);
      return;
    }

    const newArticle = { ART_NOMBRE: articleName, ESTADO: articleState };
    dispatch(agregarArticulo(newArticle));

    // **Actualiza los estados locales manualmente**
    if (articleState == 'true') {
      setBuenos((prevBuenos) => [...prevBuenos, newArticle]);
    } else {
      setMalos((prevMalos) => [...prevMalos, newArticle]);
    }

    // Reiniciar el formulario
    setArticleName('');
  };

  const handleDelete = (ART_NOMBRE) => {
    dispatch(eliminarArticulo(ART_NOMBRE));

    // Filtra los artículos para eliminar el que coincida con ART_NOMBRE
    setBuenos((prevBuenos) =>
      prevBuenos.filter((art) => art.ART_NOMBRE !== ART_NOMBRE),
    );
    setMalos((prevMalos) =>
      prevMalos.filter((art) => art.ART_NOMBRE !== ART_NOMBRE),
    );
  };

  const renderArticleItem = ({ item }) => (
    <View style={styles.listItemContainer}>
      <Text style={styles.listItem}>{item.ART_NOMBRE}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.ART_NOMBRE)}
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
                <Picker.Item label="Seleccione una opción..." value={null} />
                <Picker.Item label="Bueno" value={true} />
                <Picker.Item label="Malo" value={false} />
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
                renderItem={renderArticleItem}
                keyExtractor={(_, index) => index.toString()}
              />
            </View>
            <View style={styles.listSection}>
              <Text style={styles.listTitle}>Artículos Malos</Text>
              <FlatList
                data={malos}
                renderItem={renderArticleItem}
                keyExtractor={(_, index) => index.toString()}
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
      <GenericModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        caseType="Notificacion"
        message={modalMessage}
      />
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
});

export default AddArticleModal;
