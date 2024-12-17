import React, { useRef, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignatureModal = ({ visible, onCancel, onSave }) => {
  const [paths, setPaths] = useState([]);
  const pathRef = useRef([]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newPoint = `${gestureState.moveX},${gestureState.moveY}`;
      pathRef.current.push(newPoint);
      setPaths([...paths, `M ${pathRef.current.join(' L ')}`]);
    },
    onPanResponderRelease: () => {
      pathRef.current = [];
    },
  });

  const handleClear = () => {
    setPaths([]);
  };

  const handleSave = () => {
    if (paths.length > 0) {
      onSave(paths);
    }
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
          <Text style={styles.modalTitle}>Dibuje su firma</Text>
          <View style={styles.signatureContainer} {...panResponder.panHandlers}>
            <Svg style={styles.canvas}>
              {paths.map((pathData, index) => (
                <Path
                  key={index}
                  d={pathData}
                  stroke="black"
                  strokeWidth={3}
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
  signatureContainer: {
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
    backgroundColor: 'transparent',
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

export default SignatureModal;
