import { Buffer } from 'buffer';

const convertSignatureToBase64 = async (
  signaturePaths,
  width = 300,
  height = 150,
) => {
  if (!signaturePaths || signaturePaths.length === 0) {
    return null; // Si no hay firma, retornar null
  }

  // Crear la estructura SVG como string
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="white"/>
      ${signaturePaths
        .map(
          (path) =>
            `<path d="${path}" stroke="black" stroke-width="3" fill="none"/>`,
        )
        .join('')}
    </svg>
  `;

  // Convertir a Base64 y devolver solo la cadena
  return Buffer.from(svgString).toString('base64');
};

export default convertSignatureToBase64;
