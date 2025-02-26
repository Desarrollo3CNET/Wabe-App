import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  activarArticulo,
  desactivarArticulo,
} from '../../src/contexts/RevisionSlice';
import Header from '../../src/components/recepcion/Header';
import FooterButtonsRevision from '../../src/components/recepcion/FooterButtonsRevision';
import AddArticleModal from '../../src/components/revision/AddArticleModal';
import GenericModal from '../../src/components/recepcion/GenericModal';
import { ValidateRevisionItems } from '../../src/utils/ValidateRevisionItems';

import ArticulosPhotosModal from '../../src/components/revision/ArticulosPhotosModal';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import styles from '../../src/utils/revisionStyles';

const RodamientosDelanterosScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const articulos = useSelector(
    (state) => state.revision.articulosMantenimiento[2],
  );
  const orientation = width > 600 ? 'LANDSCAPE' : 'PORTRAIT';

  const [modalVisibleArticulo, setModalVisibleArticulo] = useState(false);
  const [modalVisibleRevision, setModalVisibleRevision] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta');
  const [modalMessage, setModalMessage] = useState('');

  const handleNext = async () => {
    const isValid = await ValidateRevisionItems(articulos.Articulos);

    if (isValid) {
      navigation.navigate('FrenosDelanterosScreen');
    } else {
      setCaseType('Notificacion');
      setModalMessage(
        'Por favor, complete al menos un estado para cada componente antes de continuar.',
      );
      setModalVisibleRevision(true);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Revisión" />
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Rodamientos Delanteros</Text>

          {articulos &&
          articulos.Articulos &&
          articulos.Articulos.length > 0 ? (
            <View
              style={
                orientation === 'LANDSCAPE'
                  ? styles.landscapeContainer
                  : styles.portraitContainer
              }
            >
              {articulos.Articulos.map((item, index) => (
                <View
                  key={item.ART_CODE}
                  style={[
                    orientation === 'LANDSCAPE'
                      ? styles.landscapeItem
                      : styles.portraitRow,
                    orientation === 'LANDSCAPE' &&
                      index % 2 === 1 &&
                      styles.secondItem,
                  ]}
                >
                  <Text style={styles.itemName}>{item.ART_NOMBRE}</Text>

                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.statusButton,
                        item.ESTADO === true && styles.selected,
                      ]}
                      onPress={() => dispatch(activarArticulo(item.ART_CODE))}
                    >
                      <Text style={styles.statusText}>Bueno</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.statusButton,
                        item.ESTADO === false && styles.selected,
                      ]}
                      onPress={() =>
                        dispatch(desactivarArticulo(item.ART_CODE))
                      }
                    >
                      <Text style={styles.statusText}>Malo</Text>

                      {/* Mostrar el botón de cámara como notificación */}
                      {item.ESTADO === false && (
                        <ArticulosPhotosModal
                          ART_CODE={item.ART_CODE}
                          ART_NOMBRE={item.ART_NOMBRE}
                          showCameraButton={true} // Hacer visible el botón de la cámara
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noItemsText}>No hay artículos disponibles</Text>
          )}
        </ScrollView>
      </View>

      <FooterButtonsRevision
        onBack={() => navigation.navigate('DireccionScreen')}
        onDelete={() => setModalVisibleArticulo(true)}
        onNext={handleNext}
      />

      <AddArticleModal
        visible={modalVisibleArticulo}
        onClose={() => setModalVisibleArticulo(false)}
      />

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

export default RodamientosDelanterosScreen;
