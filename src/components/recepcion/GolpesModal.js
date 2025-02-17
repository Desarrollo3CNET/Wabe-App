import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Switch,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProperty,
  addPath,
  undoPath,
  redoPath,
  clearPaths,
  toggleDirty,
} from '../../../src/contexts/BoletaSlice';
import Icon from 'react-native-vector-icons/FontAwesome';
import Svg, { Path } from 'react-native-svg';
import ZoomBar from '../../components/recepcion/ZoomBar';

const GolpesModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { BOL_VEH_ESTILO, BOL_UNWASHED, paths, undonePaths } = useSelector(
    (state) => state.boleta,
  );
  const [zoom, setZoom] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [localPath, setLocalPath] = useState('');
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const images = {
    Sedán: require('../../../assets/Planos Sedán.png'),
    Bus: require('../../../assets/Planos Bus.png'),
    Buseta: require('../../../assets/Planos Buseta.png'),
    Camión: require('../../../assets/Planos camión.png'),
    Camioneta: require('../../../assets/Planos camioneta.png'),
    Pickup: require('../../../assets/Planos Pickup.png'),
    SUV: require('../../../assets/Planos SUV.png'),
  };

  const handleStart = (x, y) => {
    if (!isDrawing) return;
    // Ajustar las coordenadas para el zoom y pan
    const adjustedX = (x - panX) / zoom;
    const adjustedY = (y - panY) / zoom;
    const startPoint = `M ${adjustedX},${adjustedY}`;
    setLocalPath(startPoint);
  };

  const handleMove = (x, y) => {
    if (!isDrawing || !localPath || isNaN(x) || isNaN(y)) return;
    // Ajustar las coordenadas para el zoom y pan
    const adjustedX = (x - panX) / zoom;
    const adjustedY = (y - panY) / zoom;
    const newPoint = `L ${adjustedX},${adjustedY}`;
    setLocalPath((prevPath) => `${prevPath} ${newPoint}`);
  };

  const handleEnd = () => {
    if (localPath) {
      dispatch(addPath(localPath));
      setLocalPath('');
    }
  };

  const handleUndo = () => {
    if (paths.length > 0) {
      dispatch(undoPath());
    }
  };

  const handleRedo = () => {
    if (undonePaths && undonePaths.length > 0) {
      dispatch(redoPath());
    }
  };

  const handleClear = () => {
    dispatch(clearPaths());
  };

  const handleToggleDirty = () => {
    dispatch(toggleDirty());
  };

  const handleSave = () => {
    onClose();
  };

  // Desplazamiento (Pan)
  const handlePanStart = (x, y) => {
    setIsPanning(true);
    setStartX(x);
    setStartY(y);
  };

  const handlePanMove = (x, y) => {
    if (isPanning && !isNaN(x) && !isNaN(y)) {
      const dx = x - startX || 0;
      const dy = y - startY || 0;
      setPanX((prevX) => prevX + dx);
      setPanY((prevY) => prevY + dy);
      setStartX(x);
      setStartY(y);
    }
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  return (
    <Modal transparent visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ZoomBar zoom={zoom} setZoom={setZoom} />

          <View style={styles.headerContainer}>
            <View style={[styles.headerColumn, styles.titleContainer]}>
              <Text style={styles.title}>Golpes</Text>
              <Text style={styles.subtitle}>
                Indique los golpes que tenga su vehículo
              </Text>
            </View>
            <View style={styles.headerColumn}>
              <Text style={styles.pickerLabel}>Estilo del Vehículo</Text>
              <Picker
                selectedValue={BOL_VEH_ESTILO}
                style={styles.picker}
                onValueChange={(value) =>
                  dispatch(setProperty({ key: 'BOL_VEH_ESTILO', value }))
                }
              >
                <Picker.Item label="Sedán" value="Sedán" />
                <Picker.Item label="Bus" value="Bus" />
                <Picker.Item label="Buseta" value="Buseta" />
                <Picker.Item label="Camión" value="Camión" />
                <Picker.Item label="Camioneta" value="Camioneta" />
                <Picker.Item label="Pickup" value="Pickup" />
                <Picker.Item label="SUV" value="SUV" />
              </Picker>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Nueva fila para la barra de herramientas */}
          <View style={styles.toolbarContainer}>
            <View style={styles.toolbar}>
              <TouchableOpacity style={styles.toolButton} onPress={handleUndo}>
                <Icon name="undo" size={30} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolButton} onPress={handleRedo}>
                <Icon name="repeat" size={30} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => setIsDrawing(!isDrawing)}
              >
                <Icon
                  name="pencil"
                  size={30}
                  color={isDrawing ? 'white' : '#000'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolButton} onPress={handleClear}>
                <Icon name="eraser" size={30} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.canvasContainer}>
            {/* Agregado el ScrollView horizontal para la imagen */}
            <Image
              source={images[BOL_VEH_ESTILO]}
              style={[
                styles.vehicleImage,
                {
                  transform: [{ scale: zoom }],
                  width: 'auto', // Ajuste para que la imagen no se deforme
                },
              ]}
              resizeMode="contain"
            />

            <Svg
              style={styles.canvas}
              transform={`translate(${panX || 0}, ${panY || 0}) scale(${zoom || 1})`}
            >
              {paths.map((path, index) => (
                <Path
                  key={`path-${index}`}
                  d={path}
                  stroke="yellow"
                  strokeWidth={4}
                  fill="none"
                />
              ))}
              {localPath ? (
                <Path
                  d={localPath}
                  stroke="yellow"
                  strokeWidth={4}
                  fill="none"
                />
              ) : null}
            </Svg>

            <View
              style={styles.canvasTouchArea}
              onStartShouldSetResponder={() => true}
              onResponderGrant={(e) => {
                if (isDrawing) {
                  handleStart(e.nativeEvent.locationX, e.nativeEvent.locationY);
                } else {
                  handlePanStart(
                    e.nativeEvent.locationX,
                    e.nativeEvent.locationY,
                  );
                }
              }}
              onResponderMove={(e) => {
                if (isDrawing) {
                  handleMove(e.nativeEvent.locationX, e.nativeEvent.locationY);
                } else {
                  handlePanMove(e.nativeEvent.deltaX, e.nativeEvent.deltaY);
                }
              }}
              onResponderRelease={handleEnd}
              onResponderTerminate={handlePanEnd}
            />
          </View>

          <View style={styles.footer}>
            <View style={styles.switchContainer}>
              <Switch value={BOL_UNWASHED} onValueChange={handleToggleDirty} />
              <Text style={styles.switchText}>
                Vehículo sucio. El taller no se hace responsable por daños o
                golpes ocultos.
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Icon name="save" size={18} color="#000" />
            <Text style={styles.saveText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // =========================
  // Modal Container
  // =========================
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    height: '90%',
    alignSelf: 'center',
  },

  // =========================
  // Header Section
  // =========================
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8, // Reducido para menos espacio horizontal
    paddingVertical: 8, // Reducido para menos espacio vertical
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#D1D1D1',
    zIndex: 99,
  },
  toolbarContainer: {
    zIndex: 2,
    marginTop: 10, // Espacio entre el header y la barra de herramientas
  },

  headerColumn: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5, // Reducido para más compacidad
  },
  titleContainer: {
    flexDirection: 'column',
    marginRight: 5, // Reducido para evitar mucho espacio entre columnas
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    marginTop: 4,
  },

  // Botón para cerrar el modal
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD700',
    borderRadius: 50,
    padding: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#000',
  },

  // =========================
  // Picker Section
  // =========================
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 8, // Ajusta la distancia desde la parte superior
    right: -20, // Mueve el botón hacia afuera para evitar la superposición
    backgroundColor: '#FFD700',
    borderRadius: 20, // Forma redonda
    padding: 8, // Espaciado dentro del botón
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Sombra para resaltar
  },

  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
  },

  // =========================
  // Canvas Section
  // =========================
  canvasContainer: {
    flex: 1,
    position: 'relative',
    marginTop: 10,
    overflow: 'hidden', // Esto asegura que el zoom no afecte el contenedor
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  canvasTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  // =========================
  // Zoom Section
  // =========================
  zoomSlider: {
    position: 'absolute',
    right: 10,
    height: '50%', // Ajustado al diseño
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Sombra para simular el diseño
  },
  zoomText: {
    fontSize: 12,
    marginBottom: 5,
  },
  zoomButton: {
    fontSize: 18,
    marginVertical: 5,
    color: '#000',
  },
  zoomBar: {
    width: 8,
    backgroundColor: '#DDD',
    borderRadius: 5,
    flex: 1,
    marginVertical: 5,
    position: 'relative',
  },
  zoomIndicator: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#FFD700',
    height: 10, // Indicador de progreso como en el diseño
    bottom: 0,
  },

  // =========================
  // Toolbar Section
  // =========================
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFD700',
    borderRadius: 6, // Redondeo ajustado para menor tamaño
    paddingVertical: 4, // Reducido para menor altura
    paddingHorizontal: 2, // Reducido para menor anchura
  },
  toolButton: {
    marginHorizontal: 2, // Espaciado mínimo entre botones
    padding: 2, // Área táctil compacta
  },

  // =========================
  // Footer Section
  // =========================
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 12,
    marginLeft: 5,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15, // Botón más grande
    paddingVertical: 10, // Espaciado vertical incrementado
    paddingHorizontal: 15, // Espaciado horizontal incrementado
  },
  saveText: {
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 16, // Texto más grande
  },
});

export default GolpesModal;
