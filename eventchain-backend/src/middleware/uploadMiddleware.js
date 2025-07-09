const multer = require('multer');
const path = require('path');

// Configurare storage: unde și cum se salvează fișierul
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Filtru: acceptăm doar imagini
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Doar imagini .jpeg/.jpg/.png/.webp sunt permise'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
