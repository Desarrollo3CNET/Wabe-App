import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import Slider from '@react-native-community/slider';

const ZoomBar = ({ zoom, setZoom, isModalOpen }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  // Configurar el PanResponder para detectar gestos de arrastre
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.extractOffset(); // Establece la nueva posición base después del movimiento
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.zoomBarContainer,
        { transform: pan.getTranslateTransform() },
      ]}
      {...panResponder.panHandlers}
      pointerEvents={isModalOpen ? 'none' : 'auto'} // Cambiar según si el modal está abierto
    >
      {/* Zoom Porcentaje */}
      <Text style={styles.zoomText}>{`${Math.round(zoom * 100)}%`}</Text>

      {/* Botón Zoom Out */}
      <TouchableOpacity
        style={styles.zoomButton}
        onPress={() => setZoom((prev) => Math.max(0.25, prev - 0.1))}
      >
        <Text style={styles.zoomButtonText}>-</Text>
      </TouchableOpacity>

      {/* Control deslizante */}
      <Slider
        style={styles.slider}
        minimumValue={0.25}
        maximumValue={3}
        value={zoom}
        step={10}
        onValueChange={setZoom}
        minimumTrackTintColor="#4B4B4B"
        maximumTrackTintColor="#B0BEC5"
        thumbTintColor="#4B4B4B"
        thumbStyle={styles.thumb} // Aquí añadimos el estilo para el thumb
      />

      {/* Botón Zoom In */}
      <TouchableOpacity
        style={styles.zoomButton}
        onPress={() => setZoom((prev) => Math.min(2, prev + 0.1))}
      >
        <Text style={styles.zoomButtonText}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  zoomBarContainer: {
    position: 'absolute',
    right: 10,
    top: 100,
    width: 60,
    height: 250,
    backgroundColor: '#F4F4F4',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  zoomText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B4B4B',
    marginBottom: 10,
  },
  thumb: {
    width: 30, // Ancho del thumb
    height: 60, // Altura del thumb, para hacerlo más largo verticalmente
    borderRadius: 15, // Para darle forma redonda o más estilizada
    backgroundColor: '#FFD700', // Color de fondo del thumb
  },
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  zoomButtonText: {
    fontSize: 24,
    color: '#4B4B4B',
    fontWeight: 'bold',
  },
  slider: {
    width: 40, // Ancho del slider
    height: 100, // Alto del slider
    transform: [{ rotate: '-90deg' }], // Rota el slider 90 grados
  },
});

export default ZoomBar;
