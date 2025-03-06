import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
import styles from '../../src/utils/revisionStyles';

const ServiciosScreen = ({ navigation }) => {
  const isTablet = useSelector((state) => state.app.isTablet);
  const dispatch = useDispatch();
  const articulos = useSelector(
    (state) => state.revision.articulosMantenimiento[7],
  );

  const [modalVisibleArticulo, setModalVisibleArticulo] = useState(false);
  const [modalVisibleRevision, setModalVisibleRevision] = useState(false);
  const [caseType, setCaseType] = useState('CancelBoleta');
  const [modalMessage, setModalMessage] = useState('');

  const handleNext = async () => {
    const isValid = await ValidateRevisionItems(articulos.Articulos);

    if (isValid) {
      navigation.navigate('ArticulosScreen', {
        fromScreen: 'ServiciosScreen',
      });
    } else {
      setCaseType('Notificacion');
      setModalMessage(
        'Por favor, complete al menos un estado para cada componente antes de continuar.',
      );
      setModalVisibleRevision(true);
    }
  };

  // Clasificar artículos según su lado
  const izquierda =
    articulos?.Articulos?.filter((art) => art.ART_LADO === 'I') || [];
  const derecha =
    articulos?.Articulos?.filter((art) => art.ART_LADO === 'D') || [];
  const neutros =
    articulos?.Articulos?.filter(
      (art) => art.ART_LADO !== 'I' && art.ART_LADO !== 'D',
    ) || [];

  // Agrupar artículos de izquierda y derecha en pares
  const maxPairs = Math.max(izquierda.length, derecha.length);
  const pairedArticles = Array.from({ length: maxPairs }, (_, i) => ({
    left: izquierda[i] || null,
    right: derecha[i] || null,
  }));

  return (
    <View style={styles.container}>
      <Header title="Revisión" />
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Servicios</Text>

          {isTablet ? (
            <View style={styles.landscapeContainer}>
              {neutros.map((item) => (
                <View key={item.ART_CODE} style={styles.centeredRow}>
                  <Text style={styles.itemName}>{item.ART_NOMBRE}</Text>
                  <View style={[styles.buttonsContainer, { width: '50%' }]}>
                    <TouchableOpacity
                      style={[
                        styles.buttonHalfWidth,
                        item.ESTADO === true && styles.selected,
                      ]}
                      onPress={() => dispatch(activarArticulo(item.ART_CODE))}
                    >
                      <Text style={styles.statusText}>Bueno</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.buttonHalfWidth,
                        item.ESTADO === false && styles.selected,
                      ]}
                      onPress={() =>
                        dispatch(desactivarArticulo(item.ART_CODE))
                      }
                    >
                      <Text style={styles.statusText}>Malo</Text>
                      {item.ESTADO === false && (
                        <ArticulosPhotosModal
                          ART_CODE={item.ART_CODE}
                          ART_NOMBRE={item.ART_NOMBRE}
                          showCameraButton={true}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {pairedArticles.map((pair, index) => (
                <View key={index} style={styles.row}>
                  <View style={styles.columnLeft}>
                    {pair.left && (
                      <>
                        <Text style={styles.itemName}>
                          {pair.left.ART_NOMBRE}
                        </Text>
                        <View style={styles.buttonsContainer}>
                          <TouchableOpacity
                            style={[
                              styles.statusButton,
                              pair.left.ESTADO === true && styles.selected,
                            ]}
                            onPress={() =>
                              dispatch(activarArticulo(pair.left.ART_CODE))
                            }
                          >
                            <Text style={styles.statusText}>Bueno</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.statusButton,
                              pair.left.ESTADO === false && styles.selected,
                            ]}
                            onPress={() =>
                              dispatch(desactivarArticulo(pair.left.ART_CODE))
                            }
                          >
                            <Text style={styles.statusText}>Malo</Text>
                            {pair.left.ESTADO === false && (
                              <ArticulosPhotosModal
                                ART_CODE={pair.left.ART_CODE}
                                ART_NOMBRE={pair.left.ART_NOMBRE}
                                showCameraButton={true}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>

                  <View style={styles.columnRight}>
                    {pair.right && (
                      <>
                        <Text style={styles.itemName}>
                          {pair.right.ART_NOMBRE}
                        </Text>
                        <View style={styles.buttonsContainer}>
                          <TouchableOpacity
                            style={[
                              styles.statusButton,
                              pair.right.ESTADO === true && styles.selected,
                            ]}
                            onPress={() =>
                              dispatch(activarArticulo(pair.right.ART_CODE))
                            }
                          >
                            <Text style={styles.statusText}>Bueno</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.statusButton,
                              pair.right.ESTADO === false && styles.selected,
                            ]}
                            onPress={() =>
                              dispatch(desactivarArticulo(pair.right.ART_CODE))
                            }
                          >
                            <Text style={styles.statusText}>Malo</Text>
                            {pair.right.ESTADO === false && (
                              <ArticulosPhotosModal
                                ART_CODE={pair.right.ART_CODE}
                                ART_NOMBRE={pair.right.ART_NOMBRE}
                                showCameraButton={true} // Hacer visible el botón de la cámara
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.portraitContainer}>
              {articulos?.Articulos?.length > 0 ? (
                articulos.Articulos.map((item) => (
                  <View key={item.ART_CODE} style={styles.portraitRow}>
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
                ))
              ) : (
                <Text style={styles.noItemsText}>
                  No hay artículos disponibles
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <FooterButtonsRevision
        onBack={() => navigation.navigate('FrenosTraserosScreen')}
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

export default ServiciosScreen;
