const multer = require('multer');
const path = require('path');

// Définir l'emplacement de stockage et le nom des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'CVs');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

// Filtrer les fichiers pour n'accepter que les fichiers PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
