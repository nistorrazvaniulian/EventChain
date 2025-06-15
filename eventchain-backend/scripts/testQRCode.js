const generateQRCode = require('../src/utils/generateQRCode');
const path = require('path');

const test = async () => {
  const ticketId = 'test-ticket-123';
  const qrPath = path.join(__dirname, '..', 'src', 'temp', `${ticketId}.png`);

  try {
    await generateQRCode(ticketId, qrPath);
    console.log('✅ Cod QR generat cu succes la:', qrPath);
  } catch (err) {
    console.error('❌ Eroare la generarea codului QR:', err.message);
  }
};

test();
