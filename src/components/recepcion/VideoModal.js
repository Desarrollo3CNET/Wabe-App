import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import colors from '../../utils/colors';

const VideoModal = () => {
  const [recording, setRecording] = useState(false);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: audioStatus } =
        await Camera.requestMicrophonePermissionsAsync();
      const { status: mediaStatus } =
        await MediaLibrary.requestPermissionsAsync();

      if (
        cameraStatus === 'granted' &&
        audioStatus === 'granted' &&
        mediaStatus === 'granted'
      ) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
        Alert.alert(
          'Permisos requeridos',
          'Debes otorgar permisos para grabar video y audio.',
        );
      }
    })();
  }, []);

  // Manejo de permisos según la lógica que solicitaste
  if (!permission) {
    requestPermission();
    return null;
  }

  if (!permission.granted) {
    requestPermission();
    return null;
  }

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <Text>
        No se concedieron permisos para usar la cámara y el micrófono.
      </Text>
    );
  }

  // Función para iniciar la grabación
  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setRecording(true);
        const video = await cameraRef.current.recordAsync({
          maxDuration: 30, // Duración máxima en segundos
          maxFileSize: 10000000, // Tamaño máximo en bytes (10MB)
        });
        setRecording(false);
        await MediaLibrary.saveToLibraryAsync(video.uri);
        Alert.alert('Éxito', 'Video guardado en la galería');
      } catch (error) {
        console.error(error);
        setRecording(false);
      }
    }
  };

  // Función para detener la grabación
  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setRecording(false);
    }
  };

  // Función para alternar la cámara (frontal / trasera)
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef}>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleCameraFacing}
          >
            <Icon name="refresh" size={20} color="#000" />
            <Text style={styles.actionText}>Voltear cámara</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={recording ? stopRecording : startRecording}
          >
            <Icon
              name={recording ? 'stop' : 'video-camera'}
              size={20}
              color="#000"
            />
            <Text style={styles.actionText}>
              {recording ? 'Detener' : 'Grabar'}
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginHorizontal: 10, // Espaciado uniforme
  },
  actionText: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row', // Alinea los botones en fila
    justifyContent: 'center', // Centra los botones
    alignItems: 'center',
  },
  flipButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  flipText: {
    fontSize: 18,
    color: 'white',
  },
});

export default VideoModal;
