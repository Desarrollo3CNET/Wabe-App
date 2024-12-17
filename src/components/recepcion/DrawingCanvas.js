import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

const DrawingCanvas = ({ visible, onCancel, onSave }) => {
  const [paths, setPaths] = useState([]);
  const currentPath = useRef('');

  const handleStart = (x, y) => {
    const startPoint = `M ${x},${y}`;
    currentPath.current = startPoint;
    setPaths((prevPaths) => [...prevPaths, startPoint]);
  };

  const handleMove = (x, y) => {
    const newPoint = `L ${x},${y}`;
    currentPath.current += ` ${newPoint}`;
    setPaths((prevPaths) => [...prevPaths.slice(0, -1), currentPath.current]);
  };

  const handleEnd = () => {
    currentPath.current = '';
  };

  const handleClear = () => {
    setPaths([]);
  };

  const handleSave = () => {
    onSave(paths);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Dibuja aquí</Text>
          <View
            style={styles.canvasContainer}
            onStartShouldSetResponder={() => true}
            onResponderGrant={(e) =>
              handleStart(e.nativeEvent.locationX, e.nativeEvent.locationY)
            }
            onResponderMove={(e) =>
              handleMove(e.nativeEvent.locationX, e.nativeEvent.locationY)
            }
            onResponderRelease={handleEnd}
            onMouseDown={(e) =>
              Platform.OS === 'web' &&
              handleStart(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            }
            onMouseMove={(e) =>
              Platform.OS === 'web' &&
              e.buttons === 1 &&
              handleMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            }
            onMouseUp={() => Platform.OS === 'web' && handleEnd()}
          >
            <Svg style={styles.canvas}>
              {paths.map((path, index) => (
                <Path
                  key={index}
                  d={path}
                  stroke="black"
                  strokeWidth={4}
                  fill="none"
                />
              ))}
            </Svg>
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Icon name="eraser" size={20} color="#000" />
            <Text style={styles.clearText}>Borrar</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Icon name="arrow-left" size={20} color="#000" />
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
              <Icon name="save" size={20} color="#000" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  canvasContainer: {
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  canvas: {
    flex: 1,
  },
  clearButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  clearText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 5,
  },
});

export default DrawingCanvas;