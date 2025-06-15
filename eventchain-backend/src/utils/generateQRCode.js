const QRCode = require('qrcode');

const generateQRCode = async (text, outputPath) => {
  try {
    await QRCode.toFile(outputPath, text);
  } catch (err) {
    throw new Error('Eroare la generarea codului QR: ' + err.message);
  }
};

module.exports = generateQRCode;
