import QRCode from 'qrcode'
import Jimp from "jimp";
import path from 'path'

export function generateCode(length = 10) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  return code;
}

export async function generateQR(code) {
  try {
    // Genera el código QR como un Data URL
    const qrCodeImage = await QRCode.toDataURL(code);
    return qrCodeImage;  // Devuelve la imagen en base64
  } catch (err) {
    console.error('Error al generar el QR:', err);
    throw new Error('Error al generar el código QR');
  }
}

export async function generateQRCodeWithLogo(code) {
  // Genera el código QR en formato buffer
  const qrCodeBuffer = await QRCode.toBuffer(code, {
    errorCorrectionLevel: 'H',
    color: {
      dark: '#010599FF',
      light: '#FFBF60FF',
    },
  });

  // Carga la imagen QR generada
  const qrImage = await Jimp.read(qrCodeBuffer);

  // Cargar el logo desde una URL o ruta
  const logo = await Jimp.read('public/img/logoqr.png');

  // Redimensionar el logo y colocarlo en el centro del QR
  logo.resize(qrImage.bitmap.width / 4, Jimp.AUTO);
  const x = (qrImage.bitmap.width / 2) - (logo.bitmap.width / 2);
  const y = (qrImage.bitmap.height / 2) - (logo.bitmap.height / 2);
  qrImage.composite(logo, x, y);

  // Convertir la imagen final del QR con logo a base64
  return await qrImage.getBase64Async(Jimp.MIME_PNG);
}

