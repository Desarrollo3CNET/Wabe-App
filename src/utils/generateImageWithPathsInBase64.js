import { Dimensions } from 'react-native';
import { encode } from 'base-64';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const generateImageWithPathsInBase64 = async (paths, vehicleStyle) => {
  // Definir las imágenes de fondo según el tipo de vehículo
  const images = {
    Sedán: require('../../assets/Planos Sedán.png'),
    Bus: require('../../assets/Planos Bus.png'),
    Buseta: require('../../assets/Planos Buseta.png'),
    Camión: require('../../assets/Planos camión.png'),
    Camioneta: require('../../assets/Planos camioneta.png'),
    Pickup: require('../../assets/Planos Pickup.png'),
    SUV: require('../../assets/Planos SUV.png'),
  };

  // Obtener la imagen según el estilo de vehículo
  const vehicleImage = images[vehicleStyle];

  // Verificar que las rutas y la imagen existan
  if (!paths || paths.length === 0 || !vehicleImage) {
    return null;
  }

  const { width, height } = Dimensions.get('window'); // Obtener el tamaño de la pantalla para ajustar el tamaño de la imagen y los trazos

  // Función para convertir la imagen a base64
  const imageToBase64 = async (imageSource) => {
    try {
      const asset = Asset.fromModule(imageSource);
      await asset.downloadAsync(); // Descargar la imagen
      const localUri = asset.localUri || asset.uri;
      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error al convertir la imagen a base64:', error);
      return null;
    }
  };

  // Función para generar el contenido SVG con la imagen y los trazos
  const generateBase64FromSvg = async () => {
    const imageBase64 = await imageToBase64(vehicleImage); // Convertir la imagen a base64
    if (!imageBase64) return null;

    // Crear el contenido SVG con el vehículo y los trazos
    const svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <image href="data:image/png;base64,${imageBase64}" width="${width}" height="${height}" />
        ${paths.map((path) => `<path d="${path}" stroke="yellow" stroke-width="4" fill="none" />`).join('')}
      </svg>`;

    // Codificar el SVG en base64
    const encodedSvg = encode(svgContent);

    // Quitar el prefijo "data:image/svg+xml;base64,"
    return encodedSvg.split('data:image/svg+xml;base64,')[1] || encodedSvg;
  };

  // Obtener la imagen en base64 con los trazos sobre ella
  const base64Image = await generateBase64FromSvg();
  return base64Image;
};

export default generateImageWithPathsInBase64;
