import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  setVehicleStyle,
  addPath,
  undoPath,
  clearPaths,
  toggleDirty,
} from '../../../src/contexts/store'; // Importa las acciones correctamente
import Icon from 'react-native-vector-icons/FontAwesome';
import Svg, { Path } from 'react-native-svg';

const GolpesModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { vehicleStyle, paths, isDirty } = useSelector((state) => state.golpes); // Obtener datos desde Redux
  const [zoom, setZoom] = useState(1); // Manejar zoom localmente
  const [isDrawing, setIsDrawing] = useState(false); // Activar dibujo localmente
  const currentPath = useRef(''); // Referencia para trazar caminos

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
    const startPoint = `M ${x},${y}`;
    currentPath.current = startPoint;
    dispatch(addPath(startPoint));
  };

  const handleMove = (x, y) => {
    if (!isDrawing) return;
    const newPoint = `L ${x},${y}`;
    currentPath.current += ` ${newPoint}`;
    dispatch(addPath(currentPath.current));
  };

  const handleEnd = () => {
    currentPath.current = '';
  };

  const handleUndo = () => {
    dispatch(undoPath());
  };

  const handleClear = () => {
    dispatch(clearPaths());
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(2, prevZoom + 0.25));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(1, prevZoom - 0.25));
  };

  const handleToggleDirty = () => {
    dispatch(toggleDirty());
  };

  const handleSave = () => {
    onClose(); // Cierra el modal
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerContainer}>
            {/* Columna 1: Título */}
            <View style={[styles.headerColumn, styles.titleContainer]}>
              <Text style={styles.title}>Golpes</Text>
              <Text style={styles.subtitle}>
                Indique los golpes que tenga su vehículo
              </Text>
            </View>

            {/* Columna 2: Selector de estilo */}
            <View style={styles.headerColumn}>
              <Text style={styles.pickerLabel}>Estilo del Vehículo</Text>
              <Picker
                selectedValue={vehicleStyle}
                style={styles.picker}
                onValueChange={(value) => dispatch(setVehicleStyle(value))}
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

            {/* Columna 3: Toolbar */}
            <View style={styles.headerColumn}>
              <View style={styles.toolbar}>
                <TouchableOpacity
                  style={styles.toolButton}
                  onPress={handleUndo}
                >
                  <Icon name="undo" size={18} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolButton}
                  onPress={() => setIsDrawing(!isDrawing)}
                >
                  <Icon
                    name="pencil"
                    size={18}
                    color={isDrawing ? 'white' : '#000'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolButton}
                  onPress={handleClear}
                >
                  <Icon name="eraser" size={18} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolButton}
                  onPress={handleZoomIn}
                >
                  <Icon name="search-plus" size={18} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón para cerrar */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Canvas */}
          <View style={styles.canvasContainer}>
            <Image
              source={images[vehicleStyle]}
              style={[styles.vehicleImage, { transform: [{ scale: zoom }] }]}
              resizeMode="contain"
            />
            <Svg style={styles.canvas}>
              {paths.map((path, index) => (
                <Path
                  key={index}
                  d={path}
                  stroke="yellow"
                  strokeWidth={4}
                  fill="none"
                />
              ))}
            </Svg>
            <View
              style={styles.canvasTouchArea}
              onStartShouldSetResponder={() => true}
              onResponderGrant={(e) =>
                handleStart(e.nativeEvent.locationX, e.nativeEvent.locationY)
              }
              onResponderMove={(e) =>
                handleMove(e.nativeEvent.locationX, e.nativeEvent.locationY)
              }
              onResponderRelease={handleEnd}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.switchContainer}>
              <Switch value={isDirty} onValueChange={handleToggleDirty} />
              <Text style={styles.switchText}>
                Vehículo sucio. El taller no se hace responsable por daños o
                golpes ocultos.
              </Text>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Icon name="save" size={18} color="#000" />
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
          </View>
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
