import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';

const ZoomBar = ({ zoom, setZoom }) => {
  // Función para aumentar el zoom
  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(2, prevZoom + 0.05));
  };

  // Función para reducir el zoom
  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(0.25, prevZoom - 0.05));
  };

  return (
    <View style={styles.zoomBarContainer}>
      {/* Texto del porcentaje de zoom */}
      <Text style={styles.zoomText}>{`${Math.round(zoom * 100)}%`}</Text>

      {/* Botón de Zoom Out */}
      <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
        <Text style={styles.zoomButtonText}>-</Text>
      </TouchableOpacity>

      {/* Control deslizante */}
      <Slider
        style={styles.slider}
        minimumValue={0.25}
        maximumValue={2}
        value={zoom}
        step={0.01}
        onValueChange={(value) => setZoom(value)}
        minimumTrackTintColor="#4B4B4B"
        maximumTrackTintColor="#B0BEC5"
        thumbTintColor="#4B4B4B"
      />

      {/* Botón de Zoom In */}
      <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
        <Text style={styles.zoomButtonText}>+</Text>
      </TouchableOpacity>
    </View>
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
  },
  zoomText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B4B4B',
    marginBottom: 10,
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
    width: 40,
    height: 150,
    transform: [{ rotate: '-90deg' }], // Rotación para hacer que sea vertical
  },
});

export default ZoomBar;
